"""
Overfitting Audit for AquaGov LSTM Drought Model
==================================================
Computes:
  1. R² (coefficient of determination) on train, val, and test sets
     Note: R² on a binary target measures how well predicted probabilities
     track true labels — a near-perfect R² on TRAIN but not TEST signals overfit.
  2. Binary Cross-Entropy (Log-loss) — train vs test gap
  3. Brier Score (mean squared probability error) — train vs test gap
  4. Calibration curve (reliability diagram) — are probabilities meaningful?
  5. Learning curve summary (loss/acc from training_history.json)
  6. Generalisation Gap = test_loss - train_loss (epoch 1 snapshot)
  7. Verdict: OVERFIT / OK based on gap thresholds

Outputs saved to ML/models/
"""

import os
import json
import pickle
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
import tensorflow as tf
from sklearn.metrics import (
    r2_score, log_loss, brier_score_loss,
    roc_auc_score, accuracy_score
)
from sklearn.calibration import calibration_curve

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
PROCESSED = os.path.join(BASE_DIR, "processed")
MODELS    = os.path.join(BASE_DIR, "models")

print("=" * 65)
print("  AquaGov LSTM — Overfitting Audit")
print("=" * 65)

# ── 1. Load data ──────────────────────────────────────────────────────────────
print("\n[1/6] Loading preprocessed data...")
X_train = np.load(os.path.join(PROCESSED, "X_train.npy"))
y_train = np.load(os.path.join(PROCESSED, "y_train.npy"))
X_val   = np.load(os.path.join(PROCESSED, "X_val.npy"))
y_val   = np.load(os.path.join(PROCESSED, "y_val.npy"))
X_test  = np.load(os.path.join(PROCESSED, "X_test.npy"))
y_test  = np.load(os.path.join(PROCESSED, "y_test.npy"))

print(f"  Train: {X_train.shape}  Val: {X_val.shape}  Test: {X_test.shape}")

# ── 2. Load model ─────────────────────────────────────────────────────────────
print("\n[2/6] Loading trained model...")
model_path = os.path.join(MODELS, "drought_lstm.keras")
model = tf.keras.models.load_model(model_path)
print(f"  Loaded: {model_path}")

# ── 3. Run inference ──────────────────────────────────────────────────────────
print("\n[3/6] Running inference on all splits...")
prob_train = model.predict(X_train, verbose=0).flatten()
prob_val   = model.predict(X_val,   verbose=0).flatten()
prob_test  = model.predict(X_test,  verbose=0).flatten()

THRESHOLD = 0.40
pred_train = (prob_train >= THRESHOLD).astype(int)
pred_val   = (prob_val   >= THRESHOLD).astype(int)
pred_test  = (prob_test  >= THRESHOLD).astype(int)

# ── 4. Compute metrics ────────────────────────────────────────────────────────
print("\n[4/6] Computing overfitting metrics...\n")

def metrics(y_true, y_prob, y_pred, split_name):
    r2     = r2_score(y_true, y_prob)          # R² on raw probabilities
    brier  = brier_score_loss(y_true, y_prob)  # lower = better; 0 = perfect
    ll     = log_loss(y_true, y_prob)           # lower = better
    auc    = roc_auc_score(y_true, y_prob)
    acc    = accuracy_score(y_true, y_pred)
    return dict(split=split_name, r2=r2, brier=brier, log_loss=ll, auc=auc, acc=acc)

res_train = metrics(y_train, prob_train, pred_train, "TRAIN")
res_val   = metrics(y_val,   prob_val,   pred_val,   "VAL  ")
res_test  = metrics(y_test,  prob_test,  pred_test,  "TEST ")

header = f"{'Metric':<18} {'TRAIN':>10} {'VAL':>10} {'TEST':>10}  {'Gap(TEST-TRAIN)':>17}"
print(header)
print("-" * len(header))

for key in ["r2", "brier", "log_loss", "auc", "acc"]:
    tr  = res_train[key]
    val = res_val[key]
    te  = res_test[key]
    gap = te - tr
    sign = "⬆" if gap > 0 else "⬇"
    # For brier/log_loss, higher gap = worse (more overfit)
    flag = ""
    if key in ("brier", "log_loss"):
        if gap > 0.05:  flag = "  ⚠️ OVERFIT"
    else:
        if gap < -0.05: flag = "  ⚠️ OVERFIT"
    print(f"  {key:<16} {tr:>10.5f} {val:>10.5f} {te:>10.5f}  {sign}{abs(gap):>15.5f}{flag}")

print()

# ── 5. Generalisation gap verdict ─────────────────────────────────────────────
print("[5/6] Overfitting Verdict:")
gap_brier    = res_test["brier"]  - res_train["brier"]
gap_logloss  = res_test["log_loss"] - res_train["log_loss"]
gap_auc      = res_train["auc"] - res_test["auc"]    # positive if train > test
gap_acc      = res_train["acc"] - res_test["acc"]    # positive if train > test
gap_r2       = res_train["r2"]  - res_test["r2"]

BRIER_THRESH   = 0.02
LOGLOSS_THRESH = 0.05
AUC_THRESH     = 0.01
ACC_THRESH     = 0.01
R2_THRESH      = 0.05

overfit_signals = []
if gap_brier   > BRIER_THRESH:   overfit_signals.append(f"Brier gap={gap_brier:.4f} > {BRIER_THRESH}")
if gap_logloss > LOGLOSS_THRESH: overfit_signals.append(f"LogLoss gap={gap_logloss:.4f} > {LOGLOSS_THRESH}")
if gap_auc     > AUC_THRESH:     overfit_signals.append(f"AUC gap={gap_auc:.4f} > {AUC_THRESH}")
if gap_acc     > ACC_THRESH:     overfit_signals.append(f"Accuracy gap={gap_acc:.4f} > {ACC_THRESH}")
if gap_r2      > R2_THRESH:      overfit_signals.append(f"R² gap={gap_r2:.4f} > {R2_THRESH}")

if overfit_signals:
    print("\n  ❌ OVERFIT DETECTED — signals:")
    for s in overfit_signals:
        print(f"    • {s}")
else:
    print("\n  ✅ No overfitting detected within thresholds.")
    print("     (Train and test metrics are within acceptable bounds.)")

# ── 6. Check if val_loss < train_loss (Epoch 1 pattern) ──────────────────────
print("\n[6/6] Training history analysis:")
hist_path = os.path.join(MODELS, "training_history.json")
if os.path.exists(hist_path):
    with open(hist_path) as f:
        hist = json.load(f)

    train_loss = hist.get("loss", [])
    val_loss   = hist.get("val_loss", [])
    train_acc  = hist.get("accuracy", [])
    val_acc    = hist.get("val_accuracy", [])

    print(f"  Epochs run     : {len(train_loss)}")
    if train_loss and val_loss:
        epoch1_train = train_loss[0]
        epoch1_val   = val_loss[0]
        print(f"  Epoch 1 loss   : train={epoch1_train:.4f}  val={epoch1_val:.4f}")
        if epoch1_val < epoch1_train * 0.5:
            print("  ⚠️  Val loss < 50% of Train loss at Epoch 1 → STRONG OVERFIT / DATA LEAKAGE signal")
        final_train = train_loss[-1]
        final_val   = val_loss[-1]
        print(f"  Final loss     : train={final_train:.4f}  val={final_val:.4f}")
        gen_gap = final_val - final_train
        print(f"  Generalisation gap (val_loss - train_loss): {gen_gap:+.4f}")
        if abs(gen_gap) < 0.005:
            print("  ✅ Loss gap is tiny — but check absolute values.")
        elif gen_gap > 0:
            print("  ⚠️  Val loss > Train loss — standard overfitting.")
        else:
            print("  ⚠️  Val loss < Train loss — suspicious: possible data leakage or trivial val set.")

else:
    print("  training_history.json not found — skipping history analysis.")

# ── 7. Calibration / Reliability Diagram ─────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
fig.suptitle("Overfitting Audit — AquaGov LSTM", fontsize=14, fontweight="bold")

# a) Calibration curves
for split, probs, labels, color in [
    ("Train", prob_train, y_train, "#2196F3"),
    ("Val",   prob_val,   y_val,   "#FF9800"),
    ("Test",  prob_test,  y_test,  "#4CAF50"),
]:
    frac_pos, mean_pred = calibration_curve(labels, probs, n_bins=10, strategy="uniform")
    axes[0].plot(mean_pred, frac_pos, "o-", label=split, color=color)
axes[0].plot([0, 1], [0, 1], "k--", label="Perfect", linewidth=1)
axes[0].set_title("Reliability Diagram (Calibration)")
axes[0].set_xlabel("Mean Predicted Probability")
axes[0].set_ylabel("Fraction of Positives")
axes[0].legend()
axes[0].grid(alpha=0.3)

# b) Predicted probability distributions
axes[1].hist(prob_train, bins=40, alpha=0.5, label="Train", color="#2196F3", density=True)
axes[1].hist(prob_test,  bins=40, alpha=0.5, label="Test",  color="#4CAF50", density=True)
axes[1].set_title("Predicted Probability Distribution")
axes[1].set_xlabel("Drought Probability")
axes[1].set_ylabel("Density")
axes[1].legend()
axes[1].grid(alpha=0.3)

# c) Loss curves
if os.path.exists(hist_path):
    ep = list(range(1, len(train_loss) + 1))
    axes[2].plot(ep, train_loss, label="Train Loss", color="#2196F3")
    axes[2].plot(ep, val_loss,   label="Val Loss",   color="#FF5722", linestyle="--")
    axes[2].set_title("Loss Curves (Train vs Val)")
    axes[2].set_xlabel("Epoch")
    axes[2].set_ylabel("Binary Cross-Entropy")
    axes[2].legend()
    axes[2].grid(alpha=0.3)
else:
    axes[2].text(0.5, 0.5, "No history file", ha="center", va="center")

plt.tight_layout()
out_path = os.path.join(MODELS, "overfitting_audit.png")
plt.savefig(out_path, dpi=150, bbox_inches="tight")
print(f"\n  Plot saved → {out_path}")
plt.close()

# ── Summary JSON ──────────────────────────────────────────────────────────────
summary = {
    "train": {k: round(float(v), 5) for k, v in res_train.items() if k != "split"},
    "val":   {k: round(float(v), 5) for k, v in res_val.items()   if k != "split"},
    "test":  {k: round(float(v), 5) for k, v in res_test.items()  if k != "split"},
    "gaps_test_minus_train": {
        "r2":       round(float(res_test["r2"]       - res_train["r2"]), 5),
        "brier":    round(float(res_test["brier"]    - res_train["brier"]), 5),
        "log_loss": round(float(res_test["log_loss"] - res_train["log_loss"]), 5),
        "auc":      round(float(res_test["auc"]      - res_train["auc"]), 5),
        "acc":      round(float(res_test["acc"]      - res_train["acc"]), 5),
    },
    "overfit_signals": overfit_signals,
    "verdict": "OVERFIT" if overfit_signals else "OK",
}
out_json = os.path.join(MODELS, "overfitting_audit.json")
with open(out_json, "w") as f:
    json.dump(summary, f, indent=2)
print(f"  Summary JSON → {out_json}")

print("\n" + "=" * 65)
print(f"  VERDICT: {'⚠️  OVERFIT — see signals above' if overfit_signals else '✅  OK'}")
print("=" * 65)
