"""
Predictor Engine — AquaGov ML Service
======================================
Loads the trained LSTM model + inference bundle once at startup,
exposes a clean predict() interface for the API routers.
"""

import os
import pickle
import numpy as np
from datetime import datetime
from typing import Optional
import tensorflow as tf

# ── Paths ─────────────────────────────────────────────────────────────────────
_THIS_DIR   = os.path.dirname(os.path.abspath(__file__))
_ML_DIR     = os.path.join(_THIS_DIR, "..", "ML")
_BUNDLE_PATH = os.path.join(_ML_DIR, "models", "inference_bundle.pkl")

# ── Singleton state ───────────────────────────────────────────────────────────
_model:  Optional[tf.keras.Model] = None
_bundle: Optional[dict]           = None


def _load():
    global _model, _bundle
    if _model is not None:
        return  # already loaded

    print("[predictor] Loading inference bundle...")
    with open(_BUNDLE_PATH, "rb") as f:
        _bundle = pickle.load(f)

    model_path = _bundle["model_path"]
    print(f"[predictor] Loading Keras model from {model_path}...")
    _model = tf.keras.models.load_model(model_path)

    print(f"[predictor] Ready — {_bundle['n_features']} features, "
          f"window={_bundle['window_size']} days")
    print(f"[predictor] Model accuracy: {_bundle['model_metrics']['accuracy']*100:.2f}%")


def get_bundle() -> dict:
    _load()
    return _bundle


def get_model() -> tf.keras.Model:
    _load()
    return _model


def prob_to_risk(prob: float) -> tuple[str, str]:
    """Return (risk_level, hex_color) for a given drought probability."""
    _load()
    t = _bundle["risk_thresholds"]
    c = _bundle["risk_colors"]
    if prob >= t["CRITICAL"]:
        return "CRITICAL", c["CRITICAL"]
    if prob >= t["HIGH"]:
        return "HIGH", c["HIGH"]
    if prob >= t["MEDIUM"]:
        return "MEDIUM", c["MEDIUM"]
    return "LOW", c["LOW"]


def predict_sequence(sequence: list[list[float]]) -> dict:
    """
    Predict drought probability for a single 30-day feature sequence.

    Args:
        sequence: list of 30 rows, each row is 8 floats (raw, unscaled)
                  [rainfall_mm, rain_7d, rain_30d, temp_max_c,
                   humidity_pct, gw_depth_m, availability_frac, spi_approx]

    Returns:
        {drought_probability, risk_level, risk_color, inference_ms}
    """
    _load()
    W = _bundle["window_size"]
    F = _bundle["n_features"]

    arr = np.array(sequence, dtype=np.float32)
    if arr.shape != (W, F):
        raise ValueError(
            f"Sequence shape must be ({W}, {F}), got {arr.shape}"
        )

    # Scale using training scaler
    arr_scaled = _bundle["scaler"].transform(arr).reshape(1, W, F)

    # Inference
    t0 = datetime.utcnow()
    prob = float(_model.predict(arr_scaled, verbose=0)[0][0])
    ms   = (datetime.utcnow() - t0).total_seconds() * 1000

    risk_level, risk_color = prob_to_risk(prob)
    return {
        "drought_probability": round(prob, 4),
        "risk_level":          risk_level,
        "risk_color":          risk_color,
        "inference_ms":        round(ms, 1),
    }


def predict_batch(sequences: list[list[list[float]]]) -> list[dict]:
    """
    Predict for multiple sequences in one forward pass (efficient batch).

    Args:
        sequences: list of N sequences, each (30, 8)

    Returns:
        list of N result dicts
    """
    _load()
    W = _bundle["window_size"]
    F = _bundle["n_features"]

    arr = np.array(sequences, dtype=np.float32)   # (N, 30, 8)
    N = arr.shape[0]

    # Scale: reshape to (N*30, 8), scale, reshape back
    arr_flat   = arr.reshape(-1, F)
    arr_scaled = _bundle["scaler"].transform(arr_flat).reshape(N, W, F)

    t0    = datetime.utcnow()
    probs = _model.predict(arr_scaled, verbose=0).flatten()
    ms    = (datetime.utcnow() - t0).total_seconds() * 1000

    results = []
    for i, prob in enumerate(probs):
        prob = float(prob)
        risk_level, risk_color = prob_to_risk(prob)
        results.append({
            "drought_probability": round(prob, 4),
            "risk_level":          risk_level,
            "risk_color":          risk_color,
            "inference_ms":        round(ms / N, 1),
        })
    return results
