"""
Synthetic Dataset Generator for Jal Suraksha — Jiwati Block, Chandrapur, Maharashtra
=======================================================================================
Generates three missing datasets grounded in:
  1. district_wise_rainfall_normal.csv  → Chandrapur monthly rainfall normals
  2. stage_4_drought_dataset.csv        → SPEI / climate feature distributions

Output files (saved to ML/datasets/):
  - villages.csv           →  80 villages with GPS, population, SC/ST%, water source
  - groundwater_data.csv   →  52 weeks × 80 villages of groundwater depth & trend
  - water_source_data.csv  →  monthly water source capacity & availability per village

VWSI stress distribution target  (matching PRD thresholds):
  Green  (VWSI < 0.2) : ~25%  of villages
  Yellow (0.2–0.4)    : ~30%
  Orange (0.4–0.6)    : ~25%
  Red    (>0.6)       : ~20%
"""

import numpy as np
import pandas as pd
import os
import random
from datetime import date, timedelta

# ── reproducibility ─────────────────────────────────────────────────────────────
SEED = 42
np.random.seed(SEED)
random.seed(SEED)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "datasets")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Chandrapur district IMD normals (from district_wise_rainfall_normal.csv) ────
# Cols: JAN  FEB   MAR   APR   MAY   JUN    JUL    AUG    SEP    OCT   NOV   DEC
CHANDRAPUR_NORMALS_MM = {
    1:  11.4,  2:  8.9,  3: 14.6,  4: 10.8,  5: 11.6,
    6: 180.6,  7: 374.0, 8: 374.1, 9: 203.1, 10: 65.1,
    11:  9.9, 12:  7.9
}
ANNUAL_NORMAL = 1272.0   # mm

# ── Geographic centre: Jiwati block, Chandrapur (~20.04°N, 79.58°E) ─────────────
CENTER_LAT = 20.04
CENTER_LON = 79.58
SPREAD_DEG = 0.18   # ≈ 20 km radius

N_VILLAGES = 80

# ── Village name pool (Marathi style) ────────────────────────────────────────────
PREFIXES = [
    "Wanjari", "Bori", "Nanda", "Koradi", "Gothangaon", "Taroda", "Sindewahi",
    "Mul", "Rajura", "Warora", "Bellora", "Sawargaon", "Dhaba", "Kalmeshwar",
    "Navegaon", "Pangri", "Rampuri", "Shivani", "Borala", "Amgaon", "Marda",
    "Kuli", "Ghugus", "Hingna", "Dhapewada", "Pombhurna", "Chatari", "Durgapur",
    "Ladgaon", "Jiwati", "Kothari", "Bhisi", "Moregaon", "Saori", "Chandori",
    "Pimpalwada", "Nimgaon", "Sindi", "Khodad", "Umari", "Dahegaon", "Peth",
    "Tirora", "Khursapar", "Murpar", "Gadegaon", "Sukli", "Wadgaon", "Bijli",
    "Salegaon", "Mandgaon", "Kupti", "Yerli", "Mohadi", "Yenwa", "Kosara",
    "Dhanora", "Babhulgaon", "Ghota", "Kelia", "Zarpada", "Pipri", "Khadki",
    "Pulgaon", "Borgaon", "Sawali", "Shirsoli", "Nagrala", "Kotha", "Mundri",
    "Asola", "Salbardi", "Manora", "Halewara", "Chitoda", "Wathoda", "Kuhi",
    "Metpanjra", "Bamni", "Kelapur"
]
random.shuffle(PREFIXES)
VILLAGE_NAMES = PREFIXES[:N_VILLAGES]

# ═══════════════════════════════════════════════════════════════════════════════
# DATASET 1 — villages.csv
# ═══════════════════════════════════════════════════════════════════════════════

def assign_stress_tier(idx, n):
    """Assign a stress tier index (0=Green, 1=Yellow, 2=Orange, 3=Red)
       ensuring ~25/30/25/20 distribution."""
    cut1 = int(n * 0.25)
    cut2 = cut1 + int(n * 0.30)
    cut3 = cut2 + int(n * 0.25)
    if idx < cut1:
        return 0  # Green
    elif idx < cut2:
        return 1  # Yellow
    elif idx < cut3:
        return 2  # Orange
    else:
        return 3  # Red

# shuffle indices for random assignment
shuffled = list(range(N_VILLAGES))
random.shuffle(shuffled)
stress_tier = {shuffled[i]: assign_stress_tier(i, N_VILLAGES) for i in range(N_VILLAGES)}

WATER_SOURCES = ["bore_well", "open_well", "surface_water", "piped_scheme"]
SOURCE_WEIGHTS = [0.45, 0.30, 0.15, 0.10]   # Chandrapur rural reality

villages_rows = []
for vid in range(N_VILLAGES):
    tier = stress_tier[vid]
    lat = CENTER_LAT + np.random.uniform(-SPREAD_DEG, SPREAD_DEG)
    lon = CENTER_LON + np.random.uniform(-SPREAD_DEG, SPREAD_DEG)

    # Population: higher stress → more likely smaller/marginalised village
    pop_base = {0: (1200, 3500), 1: (700, 2500), 2: (400, 1800), 3: (200, 1200)}[tier]
    population = int(np.random.uniform(*pop_base))

    # SC/ST %: Chandrapur = tribal belt, higher in red zones
    scst_base = {0: (15, 35), 1: (25, 50), 2: (35, 65), 3: (45, 82)}[tier]
    scst_pct = round(np.random.uniform(*scst_base), 1)

    # Households
    hh_size = np.random.uniform(3.8, 5.2)
    households = max(1, int(population / hh_size))

    # Water source: red zones more bore-well dependent (deepening)
    source_type = np.random.choice(
        WATER_SOURCES,
        p=[0.55, 0.25, 0.10, 0.10] if tier >= 2 else SOURCE_WEIGHTS
    )

    # JJM (Jal Jeevan Mission) beneficiary: red zones less likely connected
    jjm = np.random.choice(["Y", "N"], p=[0.4, 0.6] if tier >= 2 else [0.7, 0.3])

    # Rural/urban: all rural for block level
    rural_urban = "Rural"

    villages_rows.append({
        "village_id":          f"VLG{vid+1:04d}",
        "village_name":        VILLAGE_NAMES[vid],
        "block":               "Jiwati",
        "district":            "Chandrapur",
        "state":               "Maharashtra",
        "latitude":            round(lat, 6),
        "longitude":           round(lon, 6),
        "population":          population,
        "households":          households,
        "sc_st_percentage":    scst_pct,
        "rural_urban":         rural_urban,
        "water_source_type":   source_type,
        "jjm_beneficiary":     jjm,
        "stress_tier":         ["Green", "Yellow", "Orange", "Red"][tier],
        "active":              "Y"
    })

villages_df = pd.DataFrame(villages_rows)
path_villages = os.path.join(OUTPUT_DIR, "villages.csv")
villages_df.to_csv(path_villages, index=False)
print(f"✅  villages.csv          → {len(villages_df)} rows  →  {path_villages}")

# ═══════════════════════════════════════════════════════════════════════════════
# DATASET 2 — groundwater_data.csv
# ═══════════════════════════════════════════════════════════════════════════════
# We generate 52 weekly readings per village for Jan–Dec 2025.
# Groundwater depth is negatively correlated with rainfall:
#   - After monsoon (Oct): shallow  (~15-40m)
#   - Pre-monsoon (May):   deep     (~40-140m)
# Red/Orange villages trend DECLINING; Green/Yellow trend STABLE/RISING.

def gw_depth_series(tier, n_weeks=52, base_depth_m=None):
    """
    Returns (depths_list, trends_list, classifications_list).
    tier: 0=Green, 1=Yellow, 2=Orange, 3=Red
    """
    # Base depth after monsoon recovery
    base = {0: np.random.uniform(15, 35),
            1: np.random.uniform(28, 55),
            2: np.random.uniform(45, 90),
            3: np.random.uniform(70, 140)}[tier]

    # Weekly decline rate (m/week) – red zones > critical 0.5m/month ≈ 0.115 m/week
    decline_rates = {
        0: np.random.uniform(0.00, 0.04),    # stable/recovering
        1: np.random.uniform(0.04, 0.09),    # slow decline
        2: np.random.uniform(0.09, 0.16),    # moderate decline
        3: np.random.uniform(0.14, 0.28)     # rapid decline
    }
    rate = decline_rates[tier]

    # Monsoon recharge: weeks 23-39 (mid-June to end-September)
    MONSOON_START = 23
    MONSOON_END   = 39
    MONSOON_RECHARGE = {0: -0.35, 1: -0.28, 2: -0.20, 3: -0.12}[tier]  # negative = rising

    depths, trends, classifs = [], [], []
    depth = base
    for w in range(n_weeks):
        if MONSOON_START <= w < MONSOON_END:
            weekly_change = MONSOON_RECHARGE + np.random.normal(0, 0.05)
        else:
            weekly_change = rate + np.random.normal(0, 0.03)
        depth = max(3.0, depth + weekly_change)

        # 4-week trend classification
        if w < 4:
            trend = "stable"
        else:
            month_change = depth - depths[w - 4]
            if month_change > 0.5:
                trend = "declining"
            elif month_change < -0.3:
                trend = "rising"
            else:
                trend = "stable"

        # Classification (CGWB style)
        if depth < 40:
            classif = "safe"
        elif depth < 60:
            classif = "semi-critical"
        elif depth < 100:
            classif = "critical"
        else:
            classif = "overexploited"

        depths.append(round(depth, 2))
        trends.append(trend)
        classifs.append(classif)
    return depths, trends, classifs


START_DATE = date(2025, 1, 6)   # first Monday 2025
gw_rows = []

for _, vrow in villages_df.iterrows():
    tier_idx = ["Green", "Yellow", "Orange", "Red"].index(vrow["stress_tier"])
    depths, trends, classifs = gw_depth_series(tier_idx)
    for w in range(52):
        obs_date = START_DATE + timedelta(weeks=w)
        gw_rows.append({
            "gw_id":            f"GW{vrow['village_id']}W{w+1:02d}",
            "village_id":       vrow["village_id"],
            "village_name":     vrow["village_name"],
            "date":             obs_date.isoformat(),
            "week_number":      w + 1,
            "depth_below_surface_m": depths[w],
            "trend":            trends[w],
            "classification":   classifs[w],
            "source":           "CGWB_synthetic",
            "confidence":       "high" if tier_idx <= 1 else "medium"
        })

gw_df = pd.DataFrame(gw_rows)
path_gw = os.path.join(OUTPUT_DIR, "groundwater_data.csv")
gw_df.to_csv(path_gw, index=False)
print(f"✅  groundwater_data.csv  → {len(gw_df)} rows  →  {path_gw}")

# ═══════════════════════════════════════════════════════════════════════════════
# DATASET 3 — water_source_data.csv
# ═══════════════════════════════════════════════════════════════════════════════
# Monthly snapshot of each village's water source supply.
# Capacity and availability are derived from:
#   - Population (demand side)
#   - Stress tier (supply degradation)
#   - Monthly rainfall normals (seasonal availability)

PER_CAPITA_DEMAND_LPD = 45  # litres/person/day (MOHUA guideline)

# Availability factor by month for each tier (fraction of capacity actually delivered)
# Monsoon months (6-9) → near 100% for all; pre-monsoon (3-6) → lowest for red
AVAIL_FACTORS = {
    #  J      F      M      A      M      J      J      A      S      O      N      D
    0: [0.95, 0.90, 0.88, 0.85, 0.82, 0.98, 1.00, 1.00, 0.98, 0.94, 0.92, 0.96],
    1: [0.80, 0.75, 0.68, 0.60, 0.55, 0.90, 0.95, 0.95, 0.88, 0.82, 0.78, 0.82],
    2: [0.60, 0.52, 0.45, 0.38, 0.30, 0.75, 0.82, 0.80, 0.72, 0.62, 0.56, 0.60],
    3: [0.35, 0.28, 0.20, 0.15, 0.10, 0.55, 0.65, 0.62, 0.55, 0.40, 0.32, 0.36],
}

STATUS_MAP = {
    (0, True):  "functional",
    (1, True):  "functional",
    (2, True):  "stressed",
    (2, False): "stressed",
    (3, True):  "non-functional",
    (3, False): "non-functional",
}

ws_rows = []
for _, vrow in villages_df.iterrows():
    tier_idx = ["Green", "Yellow", "Orange", "Red"].index(vrow["stress_tier"])
    pop  = vrow["population"]
    daily_demand = pop * PER_CAPITA_DEMAND_LPD  # litres/day

    # Capacity: functional bore wells / piped schemes cover demand with margin
    capacity_factor = {0: 1.6, 1: 1.2, 2: 0.85, 3: 0.55}[tier_idx]
    capacity_lpd = int(daily_demand * capacity_factor)

    has_treatment = vrow["water_source_type"] == "piped_scheme"

    for month in range(1, 13):
        avail_frac   = AVAIL_FACTORS[tier_idx][month - 1]
        # Add seasonal noise
        avail_frac  = min(1.0, max(0.0, avail_frac + np.random.normal(0, 0.04)))
        supply_lpd   = int(capacity_lpd * avail_frac)
        supply_hrs   = round(avail_frac * 18, 1)   # max 18 hrs/day delivery
        status_key   = (min(tier_idx, 3), avail_frac > 0.3)
        availability = STATUS_MAP.get(status_key, "functional")

        ws_rows.append({
            "ws_id":                   f"WS{vrow['village_id']}M{month:02d}",
            "village_id":              vrow["village_id"],
            "village_name":            vrow["village_name"],
            "year":                    2025,
            "month":                   month,
            "month_name":              date(2025, month, 1).strftime("%B"),
            "source_type":             vrow["water_source_type"],
            "capacity_liters_per_day": capacity_lpd,
            "supply_liters_per_day":   supply_lpd,
            "availability_fraction":   round(avail_frac, 3),
            "supply_hours_per_day":    supply_hrs,
            "availability_status":     availability,
            "treatment_facility":      "Y" if has_treatment else "N",
            "daily_demand_lpd":        int(daily_demand),
            "shortfall_lpd":           max(0, int(daily_demand) - supply_lpd),
            "source":                  "JJM_synthetic"
        })

ws_df = pd.DataFrame(ws_rows)
path_ws = os.path.join(OUTPUT_DIR, "water_source_data.csv")
ws_df.to_csv(path_ws, index=False)
print(f"✅  water_source_data.csv → {len(ws_df)} rows  →  {path_ws}")

# ═══════════════════════════════════════════════════════════════════════════════
# DATASET 4 — actual_rainfall_2025.csv
# ═══════════════════════════════════════════════════════════════════════════════
# Simulate 2025 actual rainfall from Chandrapur normals using:
#   - A drought year scenario (2025 = below-normal monsoon, ENSO El Niño year)
#   - SPEI-like deviation from the stage_4 dataset's distribution
# The drought signal is distributed unevenly: some villages receive near-normal,
# others 40-70% of normal — producing a realistic spatial variability.

DROUGHT_BIAS_BY_TIER = {
    0: 1.05,   # Green  → slightly above normal
    1: 0.85,   # Yellow → 15% deficit
    2: 0.65,   # Orange → 35% deficit
    3: 0.45    # Red    → 55% deficit
}

rf_rows = []
for _, vrow in villages_df.iterrows():
    tier_idx = ["Green", "Yellow", "Orange", "Red"].index(vrow["stress_tier"])
    bias = DROUGHT_BIAS_BY_TIER[tier_idx]

    for month in range(1, 13):
        normal_mm   = CHANDRAPUR_NORMALS_MM[month]
        # Village-level spatial noise  ±15%
        village_noise = np.random.uniform(0.85, 1.15)
        actual_mm   = round(max(0, normal_mm * bias * village_noise), 1)
        deviation   = round((actual_mm - normal_mm) / max(normal_mm, 1), 3)
        # SPI approximation via normalised deviation / std
        spi_approx  = round(deviation / 0.35, 3)   # 0.35 ≈ std of monthly rainfall anomaly

        rf_rows.append({
            "rf_id":              f"RF{vrow['village_id']}M{month:02d}",
            "village_id":         vrow["village_id"],
            "village_name":       vrow["village_name"],
            "year":               2025,
            "month":              month,
            "month_name":         date(2025, month, 1).strftime("%B"),
            "actual_rainfall_mm": actual_mm,
            "normal_rainfall_mm": normal_mm,
            "deviation":          deviation,
            "spi_approx":         spi_approx,
            "source":             "IMD_synthetic"
        })

rf_df = pd.DataFrame(rf_rows)
path_rf = os.path.join(OUTPUT_DIR, "actual_rainfall_2025.csv")
rf_df.to_csv(path_rf, index=False)
print(f"✅  actual_rainfall_2025.csv→ {len(rf_df)} rows  →  {path_rf}")

# ═══════════════════════════════════════════════════════════════════════════════
# SUMMARY REPORT
# ═══════════════════════════════════════════════════════════════════════════════
print("\n" + "="*65)
print("  SYNTHETIC DATASET GENERATION COMPLETE — Jal Suraksha Pilot")
print("="*65)
print(f"\n  Location:   Jiwati Block, Chandrapur, Maharashtra")
print(f"  Villages:   {N_VILLAGES}")
print(f"  Centre:     {CENTER_LAT}°N, {CENTER_LON}°E  (±{SPREAD_DEG}° ≈ 20 km)")
print(f"\n  Stress distribution:")
tier_counts = villages_df["stress_tier"].value_counts()
for t in ["Green", "Yellow", "Orange", "Red"]:
    print(f"    {t:8s}  {tier_counts.get(t, 0):3d}  ({tier_counts.get(t, 0)/N_VILLAGES*100:.0f}%)")

print(f"\n  Files written to:  {OUTPUT_DIR}/")
print(f"    villages.csv              →  {len(villages_df):5d} rows")
print(f"    groundwater_data.csv      →  {len(gw_df):5d} rows")
print(f"    water_source_data.csv     →  {len(ws_df):5d} rows")
print(f"    actual_rainfall_2025.csv  →  {len(rf_df):5d} rows")
print(f"\n  VWSI-relevant correlations enforced:")
print(f"    Rainfall deficit ↑  →  Groundwater decline ↑  →  Stress tier ↑")
print(f"    SC/ST % higher in Orange/Red villages (equity targeting)")
print(f"    Water source capacity lower in higher-stress tiers")
print("="*65)
