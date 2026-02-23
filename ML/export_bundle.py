"""
Export Inference Bundle — AquaGov
===================================
Packs everything the FastAPI predictor needs into one pickle file:
    - MinMaxScaler (fitted on training data)
    - Feature names and ordering
    - Risk thresholds (matching PRD spec)
    - Window size and n_features
    - Training evaluation metrics
    - Dataset metadata

Output: ML/models/inference_bundle.pkl
"""

import os
import json
import pickle
from datetime import datetime

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
PROCESSED = os.path.join(BASE_DIR, "processed")
MODELS    = os.path.join(BASE_DIR, "models")

# ── Load existing scaler ──────────────────────────────────────────────────────
print("[export] Loading scaler...")
with open(os.path.join(PROCESSED, "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)

# ── Load feature names ────────────────────────────────────────────────────────
with open(os.path.join(PROCESSED, "feature_names.txt")) as f:
    feature_names = [l.strip() for l in f.readlines()]

# ── Load dataset stats ────────────────────────────────────────────────────────
with open(os.path.join(PROCESSED, "dataset_stats.json")) as f:
    dataset_stats = json.load(f)

# Try v2 evaluation first, fall back to v1
eval_v2 = os.path.join(MODELS, "evaluation_v2.json")
eval_v1 = os.path.join(MODELS, "evaluation.json")
with open(eval_v2 if os.path.exists(eval_v2) else eval_v1) as f:
    eval_metrics = json.load(f)

# ── Bundle ────────────────────────────────────────────────────────────────────
bundle = {
    # Core inference components
    "scaler":        scaler,
    "feature_names": feature_names,
    "window_size":   dataset_stats["window_size"],
    "n_features":    dataset_stats["n_features"],

    # Model path (relative to ML/ dir, loaded separately with keras)
    "model_path":    os.path.join(MODELS, "drought_lstm.keras"),

    # PRD risk thresholds
    "risk_thresholds": {
        "CRITICAL": 0.70,   # red
        "HIGH":     0.40,   # orange
        "MEDIUM":   0.20,   # yellow
        "LOW":      0.00,   # green
    },
    "risk_colors": {
        "CRITICAL": "#EF4444",
        "HIGH":     "#F97316",
        "MEDIUM":   "#EAB308",
        "LOW":      "#22C55E",
    },

    # Model performance (for /health and dashboard display)
    "model_metrics": {
        "accuracy":   eval_metrics["accuracy"],
        "auc_roc":    eval_metrics["auc_roc"],
        "f1_score":   eval_metrics["f1_score"],
        "precision":  eval_metrics["precision"],
        "recall":     eval_metrics["recall"],
        "threshold":  eval_metrics["threshold"],
    },

    # Dataset metadata
    "dataset_meta": {
        "n_villages":         dataset_stats["n_villages"],
        "total_sequences":    dataset_stats["total_sequences"],
        "location":           "Jiwati Block, Chandrapur, Maharashtra",
        "center_lat":         20.04,
        "center_lon":         79.58,
        "data_year":          2025,
    },

    # Chandrapur IMD climate normals (used by /predict/live endpoint)
    "climate_normals": {
        "tmax": {1:29.5,2:32.8,3:37.6,4:41.2,5:42.1,6:37.0,7:31.2,8:30.3,9:31.8,10:33.5,11:30.4,12:28.1},
        "rh":   {1:62,  2:46,  3:34,  4:28,  5:33,  6:71,  7:86,  8:87,  9:82, 10:70, 11:60, 12:62},
    },

    # Export metadata
    "exported_at":   datetime.utcnow().isoformat() + "Z",
    "version":       "3.0.0",   # v3: 12 features, recall-maximised, RobustScaler
}

# ── Save ──────────────────────────────────────────────────────────────────────
bundle_path = os.path.join(MODELS, "inference_bundle.pkl")
with open(bundle_path, "wb") as f:
    pickle.dump(bundle, f, protocol=pickle.HIGHEST_PROTOCOL)

size_kb = os.path.getsize(bundle_path) / 1024
print(f"[export] Saved inference_bundle.pkl  ({size_kb:.1f} KB)")
print(f"  Features ({len(feature_names)}):  {feature_names}")
print(f"  Window size: {bundle['window_size']} days")
print(f"  Model path:  {bundle['model_path']}")
print(f"  Accuracy:    {bundle['model_metrics']['accuracy']*100:.2f}%")
print(f"  AUC-ROC:     {bundle['model_metrics']['auc_roc']:.4f}")
print(f"  F1 Score:    {bundle['model_metrics']['f1_score']:.4f}")
print("\n[export] Bundle contents:")
for k, v in bundle.items():
    tname = type(v).__name__
    print(f"  {k:<20} -> {tname}")
print("\n[export] Done. Load in FastAPI with:")
print("  import pickle")
print("  bundle = pickle.load(open('models/inference_bundle.pkl','rb'))")
print("  scaler = bundle['scaler']")
