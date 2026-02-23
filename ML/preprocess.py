"""
Preprocessing Pipeline for AquaGov LSTM Drought Model
======================================================
Input:  ML/datasets/*.csv  (villages, rainfall, groundwater, water_source)
Output: ML/processed/
    X_train.npy, y_train.npy
    X_val.npy,   y_val.npy
    X_test.npy,  y_test.npy
    scaler.pkl              (MinMaxScaler fitted on train)
    feature_names.txt       (ordered list of features)
    dataset_stats.json      (shapes, class balance, split info)

Feature vector (8 features per day):
    [0] rainfall_mm          - daily interpolated from monthly
    [1] rain_7d              - 7-day rolling sum
    [2] rain_30d             - 30-day rolling sum (monthly total)
    [3] temp_max_c           - synthetic from Chandrapur IMD normals
    [4] humidity_pct         - synthetic from Chandrapur IMD normals
    [5] gw_depth_m           - groundwater depth (weekly -> daily fill)
    [6] availability_frac    - water source availability (monthly -> daily)
    [7] spi_approx           - standardised precipitation index proxy

Sequence:  30 consecutive days  -> drought_label (0 or 1) on day 31
Label:     1 if stress_tier in {Orange, Red}  (drought)
           0 if stress_tier in {Green, Yellow} (no drought)
"""

import os
import json
import pickle
import numpy as np
import pandas as pd
from datetime import date, timedelta
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

# ── paths ─────────────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
DATASETS    = os.path.join(BASE_DIR, "datasets")
PROCESSED   = os.path.join(BASE_DIR, "processed")
os.makedirs(PROCESSED, exist_ok=True)

SEED        = 42
np.random.seed(SEED)

WINDOW      = 30          # LSTM sequence length (days)
HORIZON     = 1           # predict 1 step ahead (7-day risk mapped to label)

# ── Chandrapur IMD monthly climate normals ────────────────────────────────────
# Source: India Meteorological Department district normals (Chandrapur, Vidarbha)
#   month:  1    2    3    4    5    6    7    8    9   10   11   12
TMAX_NORMALS = {
    1: 29.5, 2: 32.8, 3: 37.6, 4: 41.2, 5: 42.1,
    6: 37.0, 7: 31.2, 8: 30.3, 9: 31.8, 10: 33.5,
    11: 30.4, 12: 28.1
}
TMIN_NORMALS = {
    1: 13.1, 2: 15.8, 3: 20.6, 4: 25.4, 5: 28.7,
    6: 26.2, 7: 23.9, 8: 23.2, 9: 23.0, 10: 21.4,
    11: 15.6, 12: 12.3
}
# Mean relative humidity (%) – AM reading, Chandrapur
RH_NORMALS = {
    1: 62,  2: 46,  3: 34,  4: 28,  5: 33,
    6: 71,  7: 86,  8: 87,  9: 82, 10: 70,
    11: 60, 12: 62
}

FEATURE_NAMES = [
    "rainfall_mm",
    "rain_7d",
    "rain_30d",
    "temp_max_c",
    "humidity_pct",
    "gw_depth_m",
    "availability_frac",
    "spi_approx",
]
N_FEATURES = len(FEATURE_NAMES)


# ═══════════════════════════════════════════════════════════════════════════════
# Helper: build a daily DataFrame for one village
# ═══════════════════════════════════════════════════════════════════════════════

def build_daily_village(village_id, stress_tier, rf_vill, gw_vill, ws_vill):
    """
    Returns a daily DataFrame for the year 2025 with all 8 features + label.
    All interpolation / forward-filling happens here.
    """
    # ── date spine ────────────────────────────────────────────────────────────
    dates = pd.date_range("2025-01-01", "2025-12-31", freq="D")
    df = pd.DataFrame({"date": dates})
    df["month"] = df["date"].dt.month
    df["day_of_year"] = df["date"].dt.dayofyear

    # ── 1. Rainfall: monthly total → distribute linearly across month days ──
    # Build a month -> daily_mm lookup by spreading monthly total over its days
    rf_month = rf_vill.set_index("month")["actual_rainfall_mm"].to_dict()
    spi_month = rf_vill.set_index("month")["spi_approx"].to_dict()

    def daily_rf(row):
        m = row["month"]
        days_in_month = pd.Period(f"2025-{m:02d}", freq="M").days_in_month
        return rf_month.get(m, 0) / days_in_month

    df["rainfall_mm"] = df.apply(daily_rf, axis=1)
    # Add slight day-level noise (+/- 20%)
    noise = np.random.uniform(0.8, 1.2, size=len(df))
    df["rainfall_mm"] = (df["rainfall_mm"] * noise).clip(lower=0)

    # ── 2. Rolling rain_7d and rain_30d ──────────────────────────────────────
    df["rain_7d"]  = df["rainfall_mm"].rolling(7,  min_periods=1).sum()
    df["rain_30d"] = df["rainfall_mm"].rolling(30, min_periods=1).sum()

    # ── 3. SPI: forward-fill from monthly value ───────────────────────────────
    df["spi_approx"] = df["month"].map(spi_month)

    # ── 4. Temperature and humidity: IMD normals + Gaussian noise ────────────
    df["temp_max_c"]   = df["month"].map(TMAX_NORMALS) + np.random.normal(0, 1.2, size=len(df))
    df["temp_min_c"]   = df["month"].map(TMIN_NORMALS) + np.random.normal(0, 1.0, size=len(df))
    df["humidity_pct"] = (df["month"].map(RH_NORMALS)  + np.random.normal(0, 3.0, size=len(df))).clip(10, 100)

    # ── 5. Groundwater: weekly obs -> forward-fill to daily ─────────────────
    # gw_vill has 'date' (weekly Monday) and 'depth_below_surface_m'
    gw_daily = pd.DataFrame({"date": dates})
    gw_reindexed = gw_vill[["date", "depth_below_surface_m"]].copy()
    gw_reindexed["date"] = pd.to_datetime(gw_reindexed["date"])
    gw_reindexed = gw_reindexed.set_index("date").reindex(dates)
    gw_reindexed = gw_reindexed.ffill().bfill()
    df["gw_depth_m"] = gw_reindexed["depth_below_surface_m"].values
    # Tiny daily noise
    df["gw_depth_m"] = (df["gw_depth_m"] + np.random.normal(0, 0.15, size=len(df))).clip(lower=1.0)

    # ── 6. Water availability: monthly -> forward-fill to daily ──────────────
    ws_month = ws_vill.set_index("month")["availability_fraction"].to_dict()
    df["availability_frac"] = df["month"].map(ws_month)
    df["availability_frac"] = (df["availability_frac"] + np.random.normal(0, 0.02, size=len(df))).clip(0, 1)

    # ── 7. Drought label (static per village for this year) ──────────────────
    df["drought_label"] = 1 if stress_tier in {"Orange", "Red"} else 0

    return df


# ═══════════════════════════════════════════════════════════════════════════════
# Helper: build sliding-window sequences from one village's daily df
# ═══════════════════════════════════════════════════════════════════════════════

def build_sequences(daily_df, window=WINDOW):
    """
    Returns X (n_seq, window, n_features) and y (n_seq,).
    Target y[i] = drought_label on the day AFTER the window.
    """
    feat_cols = FEATURE_NAMES
    data = daily_df[feat_cols].values          # (365, 8)
    labels = daily_df["drought_label"].values  # (365,)

    X_list, y_list = [], []
    for i in range(len(data) - window):
        X_list.append(data[i : i + window])
        y_list.append(labels[i + window])     # label at end of window

    return np.array(X_list, dtype=np.float32), np.array(y_list, dtype=np.float32)


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    print("[preprocess] Loading datasets...")
    vl = pd.read_csv(os.path.join(DATASETS, "villages.csv"))
    rf = pd.read_csv(os.path.join(DATASETS, "actual_rainfall_2025.csv"))
    gw = pd.read_csv(os.path.join(DATASETS, "groundwater_data.csv"))
    ws = pd.read_csv(os.path.join(DATASETS, "water_source_data.csv"))

    gw["date"] = pd.to_datetime(gw["date"])

    print(f"[preprocess] Building daily sequences for {len(vl)} villages...")
    all_X, all_y = [], []

    for _, vrow in vl.iterrows():
        vid        = vrow["village_id"]
        tier       = vrow["stress_tier"]
        rf_vill    = rf[rf["village_id"] == vid].copy()
        gw_vill    = gw[gw["village_id"] == vid].copy()
        ws_vill    = ws[ws["village_id"] == vid].copy()

        if rf_vill.empty or gw_vill.empty or ws_vill.empty:
            print(f"  [WARN] Missing data for {vid}, skipping.")
            continue

        daily_df = build_daily_village(vid, tier, rf_vill, gw_vill, ws_vill)
        X_v, y_v = build_sequences(daily_df)
        all_X.append(X_v)
        all_y.append(y_v)

    X = np.concatenate(all_X, axis=0)   # (n_total, 30, 8)
    y = np.concatenate(all_y, axis=0)   # (n_total,)
    print(f"[preprocess] Total sequences: {X.shape[0]}  |  Shape: {X.shape}")

    # ── Split: 80 / 10 / 10 (stratified on label) ────────────────────────────
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.20, random_state=SEED, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, random_state=SEED, stratify=y_temp
    )
    print(f"[preprocess] Train: {X_train.shape[0]}  |  Val: {X_val.shape[0]}  |  Test: {X_test.shape[0]}")

    # ── Scale: fit on TRAIN only, apply to all ────────────────────────────────
    # Flatten time axis for scaler: (n, 30, 8) -> (n*30, 8)
    n_train, T, F = X_train.shape
    scaler = MinMaxScaler(feature_range=(0, 1))
    X_train_flat = X_train.reshape(-1, F)
    scaler.fit(X_train_flat)

    def scale(X_in):
        n, t, f = X_in.shape
        return scaler.transform(X_in.reshape(-1, f)).reshape(n, t, f).astype(np.float32)

    X_train = scale(X_train)
    X_val   = scale(X_val)
    X_test  = scale(X_test)

    # ── Save ──────────────────────────────────────────────────────────────────
    np.save(os.path.join(PROCESSED, "X_train.npy"), X_train)
    np.save(os.path.join(PROCESSED, "y_train.npy"), y_train)
    np.save(os.path.join(PROCESSED, "X_val.npy"),   X_val)
    np.save(os.path.join(PROCESSED, "y_val.npy"),   y_val)
    np.save(os.path.join(PROCESSED, "X_test.npy"),  X_test)
    np.save(os.path.join(PROCESSED, "y_test.npy"),  y_test)

    with open(os.path.join(PROCESSED, "scaler.pkl"), "wb") as f:
        pickle.dump(scaler, f)

    with open(os.path.join(PROCESSED, "feature_names.txt"), "w") as f:
        f.write("\n".join(FEATURE_NAMES))

    # ── Stats ─────────────────────────────────────────────────────────────────
    pos_total = int(y.sum())
    neg_total = int(len(y) - pos_total)
    stats = {
        "total_sequences":   int(X.shape[0]),
        "window_size":        WINDOW,
        "n_features":         N_FEATURES,
        "feature_names":      FEATURE_NAMES,
        "n_villages":         len(vl),
        "class_balance": {
            "drought_1":     pos_total,
            "no_drought_0":  neg_total,
            "pct_drought":   round(pos_total / len(y) * 100, 1),
        },
        "splits": {
            "train": int(X_train.shape[0]),
            "val":   int(X_val.shape[0]),
            "test":  int(X_test.shape[0]),
        },
        "scaler": "MinMaxScaler(0,1) fitted on train only",
    }
    with open(os.path.join(PROCESSED, "dataset_stats.json"), "w") as f:
        json.dump(stats, f, indent=2)

    print("\n[preprocess] Done. Files saved to ML/processed/")
    print(f"  X_train : {X_train.shape}  y_train : {y_train.shape}")
    print(f"  X_val   : {X_val.shape}    y_val   : {y_val.shape}")
    print(f"  X_test  : {X_test.shape}   y_test  : {y_test.shape}")
    print(f"  Class balance: {stats['class_balance']['pct_drought']}% drought")
    print(f"  Scaler  : saved to processed/scaler.pkl")
    print(f"  Stats   : saved to processed/dataset_stats.json")


if __name__ == "__main__":
    main()
