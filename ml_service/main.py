"""
AquaGov ML Microservice — FastAPI
===================================
Run with:
    cd ml_service
    uvicorn main:app --reload --port 8001

Endpoints:
    GET  /health                 → status + model metrics
    GET  /risk-levels            → risk level definitions
    POST /predict                → predict single village (full sequence)
    POST /predict/batch          → predict multiple villages (batch)
    POST /predict/live/{id}      → predict using pre-built dataset for a village
    GET  /predict/risk-map       → risk map for ALL 80 villages (for dashboard heatmap)
"""

import os
import sys
import time
import pickle
import numpy as np
import pandas as pd
from datetime import datetime, date, timedelta
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware

# Make the ML directory importable
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_ML_DIR   = os.path.join(_THIS_DIR, "..", "ML")
sys.path.insert(0, _ML_DIR)

import predictor as pred
from schemas import (
    PredictRequest, BatchPredictRequest, LiveDataRequest,
    PredictionResult, BatchPredictionResult,
    VillageRiskMapItem, RiskMapResponse,
    HealthResponse, RiskLevelDef,
)

# ── Startup timestamp ──────────────────────────────────────────────────────────
_START_TIME = time.time()

# ── Chandrapur IMD normals (mirrors preprocess.py) ─────────────────────────────
CHANDRAPUR_NORMALS_MM = {
    1:11.4, 2:8.9, 3:14.6, 4:10.8, 5:11.6,
    6:180.6, 7:374.0, 8:374.1, 9:203.1, 10:65.1,
    11:9.9, 12:7.9
}

# ── Lifespan: warm up model on startup ────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[startup] Pre-loading LSTM model + bundle...")
    pred.get_model()   # triggers singleton load
    print("[startup] Model ready.")
    yield
    print("[shutdown] Bye.")

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AquaGov ML Service",
    description=(
        "LSTM-powered drought prediction microservice for Jiwati Block, "
        "Chandrapur, Maharashtra. Predicts drought probability over the next "
        "7 days from a 30-day feature sequence."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helper: build a 30-day sequence for a village from the CSV datasets ────────
_villages_df:    Optional[pd.DataFrame] = None
_rainfall_df:    Optional[pd.DataFrame] = None
_gw_df:          Optional[pd.DataFrame] = None
_ws_df:          Optional[pd.DataFrame] = None

def _load_datasets():
    global _villages_df, _rainfall_df, _gw_df, _ws_df
    if _villages_df is not None:
        return
    ds = os.path.join(_ML_DIR, "datasets")
    _villages_df = pd.read_csv(os.path.join(ds, "villages.csv"))
    _rainfall_df = pd.read_csv(os.path.join(ds, "actual_rainfall_2025.csv"))
    _gw_df       = pd.read_csv(os.path.join(ds, "groundwater_data.csv"))
    _ws_df       = pd.read_csv(os.path.join(ds, "water_source_data.csv"))
    _gw_df["date"] = pd.to_datetime(_gw_df["date"])
    print("[datasets] Loaded 4 CSV datasets from ML/datasets/")


def _build_sequence_for_village(village_id: str, month: Optional[int] = None) -> list[list[float]]:
    """Reconstruct a 30-day feature window for a village using synthetic CSVs."""
    _load_datasets()
    bundle = pred.get_bundle()
    norms  = bundle["climate_normals"]

    vrow = _villages_df[_villages_df["village_id"] == village_id]
    if vrow.empty:
        raise HTTPException(status_code=404, detail=f"Village '{village_id}' not found")
    vrow = vrow.iloc[0]

    rf_v = _rainfall_df[_rainfall_df["village_id"] == village_id]
    gw_v = _gw_df[_gw_df["village_id"] == village_id].copy()
    ws_v = _ws_df[_ws_df["village_id"] == village_id]

    # Use current month if not specified
    current_month = month or datetime.utcnow().month
    # Build 30 days ending at the end of current_month
    # Use the monthly values + spread across days (same as preprocess.py)
    days_in_month = pd.Period(f"2025-{current_month:02d}", freq="M").days_in_month

    # Monthly feature lookup
    rf_row = rf_v[rf_v["month"] == current_month]
    ws_row = ws_v[ws_v["month"] == current_month]

    monthly_rf    = float(rf_row["actual_rainfall_mm"].values[0]) if not rf_row.empty else 0.0
    spi           = float(rf_row["spi_approx"].values[0])         if not rf_row.empty else 0.0
    avail_frac    = float(ws_row["availability_fraction"].values[0]) if not ws_row.empty else 0.5

    # Take latest groundwater depth
    gw_depth = float(gw_v.sort_values("date")["depth_below_surface_m"].iloc[-1]) if not gw_v.empty else 50.0

    daily_rf  = monthly_rf / max(days_in_month, 1)
    tmax      = norms["tmax"].get(current_month, 32.0)
    rh        = norms["rh"].get(current_month, 60.0)

    seq = []
    cum_7d  = 0.0
    cum_30d = 0.0
    for day in range(30):
        noise    = np.random.uniform(0.8, 1.2)
        day_rf   = max(0.0, daily_rf * noise)
        cum_7d   = cum_7d  + day_rf if day < 7  else cum_7d  - (daily_rf * 0.8) + day_rf
        cum_30d  = cum_30d + day_rf

        day_tmax = tmax + np.random.normal(0, 1.2)
        day_rh   = float(np.clip(rh + np.random.normal(0, 3), 10, 100))
        day_gw   = float(max(1.0, gw_depth + np.random.normal(0, 0.15)))
        day_av   = float(np.clip(avail_frac + np.random.normal(0, 0.02), 0, 1))

        seq.append([
            round(day_rf,  4),
            round(cum_7d,  4),
            round(cum_30d, 4),
            round(day_tmax,4),
            round(day_rh,  4),
            round(day_gw,  4),
            round(day_av,  4),
            round(spi,     4),
        ])
    return seq


# ══════════════════════════════════════════════════════════════════════════════
# ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health():
    """Service health + model performance metrics."""
    b = pred.get_bundle()
    return HealthResponse(
        status        = "ok",
        model_loaded  = True,
        model_metrics = b["model_metrics"],
        feature_names = b["feature_names"],
        window_size   = b["window_size"],
        version       = b["version"],
        uptime_s      = round(time.time() - _START_TIME, 1),
    )


@app.get("/risk-levels", response_model=list[RiskLevelDef], tags=["Reference"])
async def risk_levels():
    """Return the PRD-aligned risk level definitions used by the model."""
    b = pred.get_bundle()
    t = b["risk_thresholds"]
    c = b["risk_colors"]
    return [
        RiskLevelDef(level="LOW",      min_prob=0.00, max_prob=t["MEDIUM"],   color=c["LOW"],      label="No drought risk",        sms_trigger=False),
        RiskLevelDef(level="MEDIUM",   min_prob=t["MEDIUM"],   max_prob=t["HIGH"],     color=c["MEDIUM"],   label="Moderate risk — monitor", sms_trigger=False),
        RiskLevelDef(level="HIGH",     min_prob=t["HIGH"],     max_prob=t["CRITICAL"], color=c["HIGH"],     label="High risk — alert ready",  sms_trigger=True),
        RiskLevelDef(level="CRITICAL", min_prob=t["CRITICAL"], max_prob=1.00,          color=c["CRITICAL"], label="Critical — SMS triggered", sms_trigger=True),
    ]


@app.post("/predict", response_model=PredictionResult, tags=["Prediction"])
async def predict_single(req: PredictRequest):
    """
    Predict drought probability from a raw 30-day feature sequence.
    The sequence should be UNSCALED; the API applies the MinMaxScaler internally.
    """
    try:
        result = pred.predict_sequence(req.sequence)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return PredictionResult(
        village_id          = req.village_id,
        predicted_at        = datetime.utcnow().isoformat() + "Z",
        **result,
    )


@app.post("/predict/batch", response_model=BatchPredictionResult, tags=["Prediction"])
async def predict_batch_endpoint(req: BatchPredictRequest):
    """
    Batch predict for multiple villages in a single forward pass.
    Efficient for the daily cron that updates all 80 villages at once.
    """
    sequences = [v.sequence for v in req.villages]
    t0 = time.time()
    try:
        results = pred.predict_batch(sequences)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    total_ms = (time.time() - t0) * 1000

    now = datetime.utcnow().isoformat() + "Z"
    predictions = [
        PredictionResult(
            village_id   = req.villages[i].village_id,
            predicted_at = now,
            **results[i],
        )
        for i in range(len(req.villages))
    ]
    return BatchPredictionResult(
        predictions    = predictions,
        total_ms       = round(total_ms, 1),
        villages_count = len(predictions),
    )


@app.get("/predict/live/{village_id}", response_model=PredictionResult, tags=["Prediction"])
async def predict_live(
    village_id: str = Path(..., examples=["VLG0001"]),
    month: Optional[int] = None,
):
    """
    Predict for a specific village using its pre-built synthetic dataset.
    The API auto-constructs the 30-day feature window — no need to provide raw data.
    Pass ?month=1-12 to simulate a specific month (defaults to current month).
    """
    seq = _build_sequence_for_village(village_id, month)
    try:
        result = pred.predict_sequence(seq)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return PredictionResult(
        village_id   = village_id,
        predicted_at = datetime.utcnow().isoformat() + "Z",
        **result,
    )


@app.get("/predict/risk-map", response_model=RiskMapResponse, tags=["Prediction"])
async def risk_map(month: Optional[int] = None, cached: bool = False):
    """
    Run predictions for ALL 80 villages and return a GeoJSON-ready risk map.
    This is the primary endpoint called by the dashboard heatmap & cron job.

    Returns village GPS coordinates + drought probability + risk level for each.
    """
    _load_datasets()
    villages = _villages_df.to_dict("records")

    # Build all sequences in parallel (list comprehension)
    sequences = []
    valid_villages = []
    for vrow in villages:
        try:
            seq = _build_sequence_for_village(vrow["village_id"], month)
            sequences.append(seq)
            valid_villages.append(vrow)
        except Exception:
            continue  # skip if missing data

    # Batch predict
    results = pred.predict_batch(sequences)

    # Assemble response
    items = []
    summary = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
    for vrow, res in zip(valid_villages, results):
        level = res["risk_level"]
        summary[level] = summary.get(level, 0) + 1
        items.append(VillageRiskMapItem(
            village_id          = vrow["village_id"],
            village_name        = vrow["village_name"],
            latitude            = vrow["latitude"],
            longitude           = vrow["longitude"],
            drought_probability = res["drought_probability"],
            risk_level          = level,
            risk_color          = res["risk_color"],
            stress_tier         = vrow["stress_tier"],
            population          = vrow["population"],
        ))

    return RiskMapResponse(
        timestamp = datetime.utcnow().isoformat() + "Z",
        villages  = items,
        summary   = summary,
    )
