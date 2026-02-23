"""
backend/app/ml/predictor.py
===========================
Bridge between the FastAPI backend and the new ML engine in ml_service/.

The ml_service predictor uses a 30-day × 8-feature LSTM sequence.
This module:
  1. Delegates `predict_sequence` / `predict_batch` to ml_service/predictor.py
  2. Exposes a backward-compatible `predict_single(rainfall, temperature, ...)`
     that BUILDS a synthetic 30-day sequence from simple district-level scalars,
     so the existing `/api/predict` endpoint keeps working with no schema changes.
  3. Exposes `predict_single_village(village_id)` for the new village-level
     `/predict/risk-map` flow used by the dashboard.
"""
from __future__ import annotations
import os
import sys
import random
import numpy as np
from datetime import datetime

# ── Inject ml_service into sys.path once ──────────────────────────────────────
_BACKEND_DIR    = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_ML_SERVICE_DIR = os.path.join(_BACKEND_DIR, "..", "ml_service")
_ML_DIR         = os.path.join(_BACKEND_DIR, "..", "ML")

if _ML_SERVICE_DIR not in sys.path:
    sys.path.insert(0, _ML_SERVICE_DIR)
if _ML_DIR not in sys.path:
    sys.path.insert(0, _ML_DIR)

import predictor as _pred   # ml_service/predictor.py


# ── Public API ────────────────────────────────────────────────────────────────

def load_model():
    """Pre-warm the singleton (called from main.py lifespan)."""
    _pred.get_model()


def get_model_version() -> str:
    try:
        b = _pred.get_bundle()
        return b.get("version", "lstm-v1")
    except Exception:
        return "demo-fallback"


def predict_sequence(sequence: list[list[float]]) -> dict:
    """
    Predict from a raw 30×8 feature sequence.
    Returns: {drought_probability, risk_level, risk_color, inference_ms}
    """
    return _pred.predict_sequence(sequence)


def _build_sequence_from_scalars(
    rainfall: float,
    temperature: float,
    humidity: float,
    rain_7d: float,
    rain_30d: float,
    district_id: int = 0,
) -> list[list[float]]:
    """
    Build a synthetic 30-day × 8-feature sequence from district-level scalar inputs.
    Features: [rainfall_mm, rain_7d, rain_30d, temp_max_c, humidity_pct, gw_depth_m, availability_frac, spi_approx]
    """
    rng = random.Random(district_id)
    seq: list[list[float]] = []
    cum_7  = 0.0
    cum_30 = 0.0
    for day in range(30):
        noise    = rng.uniform(0.8, 1.2)
        day_rf   = max(0.0, (rainfall / 30) * noise)
        cum_7    = cum_7 + day_rf if day < 7 else cum_7 - (rainfall / 30 * 0.8) + day_rf
        cum_30   = cum_30 + day_rf
        day_temp = temperature + rng.gauss(0, 1.0)
        day_hum  = float(np.clip(humidity + rng.gauss(0, 3), 10, 100))
        gw_depth = float(np.clip(50 - cum_30 * 0.05 + rng.gauss(0, 0.2), 5, 80))
        avail    = float(np.clip(0.6 - (1 - min(rain_30d, 200) / 200) * 0.4 + rng.gauss(0, 0.02), 0, 1))
        spi      = (rain_30d - 80) / 60
        seq.append([
            round(day_rf,   4),
            round(cum_7,    4),
            round(cum_30,   4),
            round(day_temp, 4),
            round(day_hum,  4),
            round(gw_depth, 4),
            round(avail,    4),
            round(spi,      4),
        ])
    return seq


def predict_batch(records: list[dict]) -> list[dict]:
    """
    Batch predict for a list of district-level climate dicts.
    Each record must have: district_id, rainfall, temperature, humidity, rain_7d, rain_30d.
    Builds a 30-day synthetic sequence per district and runs one LSTM forward pass.
    Returns list of {drought_prob, risk_level, predicted_at}.
    """
    sequences = []
    for rec in records:
        seq = _build_sequence_from_scalars(
            rainfall    = float(rec.get("rainfall",    10.0)),
            temperature = float(rec.get("temperature", 35.0)),
            humidity    = float(rec.get("humidity",    40.0)),
            rain_7d     = float(rec.get("rain_7d",     20.0)),
            rain_30d    = float(rec.get("rain_30d",    60.0)),
            district_id = int(rec.get("district_id",   0)),
        )
        sequences.append(seq)

    try:
        raw = _pred.predict_batch(sequences)
        now = datetime.utcnow().isoformat()
        return [
            {
                "drought_prob": r["drought_probability"],
                "risk_level":   r["risk_level"],
                "predicted_at": now,
            }
            for r in raw
        ]
    except Exception as exc:
        print(f"[predictor] batch LSTM failed ({exc}), using heuristic")
        return [
            _heuristic_predict(
                rec.get("rainfall", 10),
                rec.get("temperature", 35),
                rec.get("humidity", 40),
                rec.get("rain_7d", 20),
                rec.get("rain_30d", 60),
            )
            for rec in records
        ]


def predict_single(
    rainfall:    float,
    temperature: float,
    humidity:    float,
    rain_7d:     float,
    rain_30d:    float,
    district_id: int = 0,
) -> dict:
    """
    Backward-compatible shim for the existing POST /api/predict endpoint.
    Builds a 30-day sequence from scalar inputs and runs LSTM inference.
    Returns: {drought_prob, risk_level, predicted_at}
    """
    seq = _build_sequence_from_scalars(rainfall, temperature, humidity, rain_7d, rain_30d, district_id)
    try:
        result = _pred.predict_sequence(seq)
        return {
            "drought_prob": result["drought_probability"],
            "risk_level":   result["risk_level"],
            "predicted_at": datetime.utcnow().isoformat(),
        }
    except Exception as exc:
        print(f"[predictor] LSTM failed ({exc}), using heuristic fallback")
        return _heuristic_predict(rainfall, temperature, humidity, rain_7d, rain_30d)


def _heuristic_predict(rainfall, temperature, humidity, rain_7d, rain_30d) -> dict:
    """Simple rule-based fallback when the model can't load."""
    score = 0.0
    score += max(0, (40 - rain_30d) / 40) * 0.5
    score += max(0, (temperature - 30) / 20) * 0.25
    score += max(0, (30 - humidity) / 30) * 0.25
    prob = float(np.clip(score, 0, 1))

    if prob >= 0.70:   risk = "CRITICAL"
    elif prob >= 0.40: risk = "HIGH"
    elif prob >= 0.20: risk = "MEDIUM"
    else:              risk = "LOW"

    return {
        "drought_prob": round(prob, 4),
        "risk_level":   risk,
        "predicted_at": datetime.utcnow().isoformat(),
    }
