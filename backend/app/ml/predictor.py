"""
LSTM Model Predictor – runtime inference module.
Loads the saved model.h5 + scaler.pkl once and exposes predict_district().
Falls back to a deterministic synthetic predictor if model.h5 is not found
(useful during hackathon demo before training is complete).
"""
from __future__ import annotations
import os
import pickle
import numpy as np
from datetime import datetime
from typing import Optional

# Globals – loaded once at startup
_model = None
_scaler = None
_model_version = "demo-fallback"

FEATURES = ["rainfall", "temperature", "humidity", "rain_7d", "rain_30d"]
SEQ_LEN  = 30
MODEL_PATH  = os.getenv("MODEL_PATH",  "app/ml/model.h5")
SCALER_PATH = os.getenv("SCALER_PATH", "app/ml/scaler.pkl")


def load_model() -> None:
    """Called once at FastAPI startup."""
    global _model, _scaler, _model_version

    if os.path.exists(SCALER_PATH):
        with open(SCALER_PATH, "rb") as f:
            _scaler = pickle.load(f)
        print(f"  Scaler loaded from {SCALER_PATH}")

    if os.path.exists(MODEL_PATH):
        try:
            import tensorflow as tf
            _model = tf.keras.models.load_model(MODEL_PATH)
            _model_version = f"lstm-v1.0-{os.path.getmtime(MODEL_PATH):.0f}"
            print(f"  LSTM model loaded from {MODEL_PATH}")
        except Exception as exc:
            print(f"  ⚠️  Could not load TF model: {exc}. Using fallback.")
            _model = None
    else:
        print(f"  ℹ️  Model file not found at {MODEL_PATH}. Using fallback predictor.")


def _fallback_predict(
    rainfall: float,
    temperature: float,
    humidity: float,
    rain_7d: float,
    rain_30d: float,
) -> float:
    """Deterministic heuristic – used when model.h5 is not yet trained."""
    score  = max(0, (42 - rainfall)    / 42)    * 0.35
    score += max(0, (temperature - 28) / 20)    * 0.25
    score += max(0, (60 - humidity)    / 60)    * 0.20
    score += max(0, (50 - rain_7d)     / 50)    * 0.10
    score += max(0, (200 - rain_30d)   / 200)   * 0.10
    return float(np.clip(score, 0.0, 1.0))


def predict_single(
    rainfall: float,
    temperature: float,
    humidity: float,
    rain_7d: float,
    rain_30d: float,
) -> dict:
    """
    Return drought_prob and risk_level for a single observation.
    Uses LSTM model if available, else fallback.
    """
    from app.schemas import prob_to_risk

    if _model is not None and _scaler is not None:
        feat = np.array([[rainfall, temperature, humidity, rain_7d, rain_30d]], dtype=np.float32)
        feat_scaled = _scaler.transform(feat)
        # Repeat the single observation SEQ_LEN times to form a valid sequence
        sequence = np.tile(feat_scaled, (SEQ_LEN, 1))[np.newaxis, :, :]  # (1, 30, 5)
        prob = float(_model.predict(sequence, verbose=0)[0][0])
    else:
        prob = _fallback_predict(rainfall, temperature, humidity, rain_7d, rain_30d)

    return {
        "drought_prob": round(prob, 4),
        "risk_level": prob_to_risk(prob),
        "model_version": _model_version,
        "predicted_at": datetime.utcnow().isoformat(),
    }


def predict_batch(records: list[dict]) -> list[dict]:
    """
    Batch prediction for multiple districts.
    Each record: {district_id, rainfall, temperature, humidity, rain_7d, rain_30d}
    Returns list of prediction dicts.
    """
    results = []
    for rec in records:
        pred = predict_single(
            rainfall    = rec["rainfall"],
            temperature = rec["temperature"],
            humidity    = rec["humidity"],
            rain_7d     = rec["rain_7d"],
            rain_30d    = rec["rain_30d"],
        )
        pred["district_id"] = rec.get("district_id")
        pred["district_name"] = rec.get("district_name")
        results.append(pred)
    return results


def get_model_version() -> str:
    return _model_version
