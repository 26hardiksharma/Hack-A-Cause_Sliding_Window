"""
LSTM Drought Model Training v2 — AquaGov (Recall-Maximized)
============================================================
Architecture:  LSTM(64) -> Dropout(0.4) -> LayerNorm -> LSTM(32) -> Dropout(0.4) -> Dense(1, sigmoid)
Input shape:   (batch, 30, 9)   — 30-day window, 9 engineered features
Output:        drought probability in [0, 1]
Loss:          Focal Loss (gamma=2) — heavily penalizes missed droughts (false negatives)
Threshold:     0.30 (lowered from 0.40 to maximise recall per PRD requirement)
Monitor:       val_recall (not val_auc) — we cannot afford false negatives

Key anti-overfit changes vs v1:
  1. Smaller LSTM units (64/32 instead of 50/50) — reduced capacity
  2. Higher Dropout (0.4 vs 0.2) — more regularization
  3. Higher L2 (5e-4 vs 1e-4)
  4. BatchNormalization between LSTM layers
  5. Focal Loss (penalises confident false negatives)
  6. Class weights: drought weighted 3x (maximise recall)
  7. Threshold lowered to 0.30 (more sensitive = higher recall)
  8. EarlyStopping monitors val_recall (not val_auc)
  9. ReduceLROnPlateau on val_recall

Outputs (saved to ML/models/):
    drought_lstm.keras        — final model
    best_model.keras          — best checkpoint (val_recall)
    training_history_v2.json  — epoch-by-epoch metrics
    evaluation_v2.json        — final test-set metrics
"""

import os
import json
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, callbacks, regularizers
from sklearn.metrics import (
    classification_report, confusion_matrix,
    roc_auc_score, f1_score, precision_score, recall_score
)

# ── paths ──────────────────────────────────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
PROCESSED = os.path.join(BASE_DIR, "processed")
MODELS    = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS, exist_ok=True)

SEED = 42
tf.random.set_seed(SEED)
np.random.seed(SEED)

# ── hyperparameters ────────────────────────────────────────────────────────────────────────────────────────────────
LSTM_UNITS_1    = 80      # slightly larger — richer representations from 12 features
LSTM_UNITS_2    = 48      # bottleneck compression
DROPOUT_RATE    = 0.35    # balanced between v1(0.20) and v2(0.40)
L2_REG          = 4e-4
LEARNING_RATE   = 5e-4
BATCH_SIZE      = 32      # small for noisy gradient regularisation
EPOCHS          = 100
PATIENCE        = 15
THRESHOLD       = 0.35    # raised from 0.30 → reduces FP without losing much recall
DROUGHT_CLASS_WEIGHT = 2.0  # reduced from 3.0 → less FP bias


# ── Custom Focal Loss ────────────────────────────────────────────────────────
def focal_loss(gamma=2.0, alpha=0.70):
    """
    Focal Loss — gamma=2 focuses on hard samples.
    alpha=0.70 (slightly reduced from 0.75) to reduce FP bias while maintaining recall.
    """
    def loss_fn(y_true, y_pred):
        y_pred   = tf.clip_by_value(y_pred, 1e-7, 1 - 1e-7)
        bce      = -y_true * tf.math.log(y_pred) - (1 - y_true) * tf.math.log(1 - y_pred)
        p_t      = y_true * y_pred + (1 - y_true) * (1 - y_pred)
        focal_wt = tf.pow(1.0 - p_t, gamma)
        alpha_t  = y_true * alpha + (1 - y_true) * (1 - alpha)
        return tf.reduce_mean(alpha_t * focal_wt * bce)
    loss_fn.__name__ = "focal_loss"
    return loss_fn


# ═══════════════════════════════════════════════════════════════════════════════
def load_data():
    print("[train-v2] Loading preprocessed arrays...")
    X_train = np.load(os.path.join(PROCESSED, "X_train.npy"))
    y_train = np.load(os.path.join(PROCESSED, "y_train.npy"))
    X_val   = np.load(os.path.join(PROCESSED, "X_val.npy"))
    y_val   = np.load(os.path.join(PROCESSED, "y_val.npy"))
    X_test  = np.load(os.path.join(PROCESSED, "X_test.npy"))
    y_test  = np.load(os.path.join(PROCESSED, "y_test.npy"))

    with open(os.path.join(PROCESSED, "feature_names.txt")) as f:
        feature_names = [l.strip() for l in f.readlines()]

    n_features = X_train.shape[2]
    window     = X_train.shape[1]
    print(f"  Train: {X_train.shape}  Val: {X_val.shape}  Test: {X_test.shape}")
    print(f"  Features ({n_features}): {feature_names}")
    print(f"  Class balance — train: {y_train.mean()*100:.1f}% drought | "
          f"val: {y_val.mean()*100:.1f}% | test: {y_test.mean()*100:.1f}%")
    return X_train, y_train, X_val, y_val, X_test, y_test, n_features, window


def build_model(window, n_features):
    """
    Regularized LSTM with:
      - Smaller capacity (64→32 units)
      - Higher Dropout (0.40)
      - BatchNormalization to stabilise training
      - L2 on all LSTM kernels
    """
    inp = keras.Input(shape=(window, n_features), name="sequence_input")

    x = layers.LSTM(
        LSTM_UNITS_1,
        return_sequences=True,
        kernel_regularizer=regularizers.l2(L2_REG),
        recurrent_regularizer=regularizers.l2(L2_REG / 2),
        recurrent_dropout=0.15,   # recurrent dropout reduces LSTM overfitting
        name="lstm_1"
    )(inp)
    x = layers.Dropout(DROPOUT_RATE, name="dropout_1")(x)
    x = layers.LayerNormalization(name="layer_norm_1")(x)

    x = layers.LSTM(
        LSTM_UNITS_2,
        return_sequences=False,
        kernel_regularizer=regularizers.l2(L2_REG),
        recurrent_regularizer=regularizers.l2(L2_REG / 2),
        recurrent_dropout=0.10,
        name="lstm_2"
    )(x)
    x = layers.Dropout(DROPOUT_RATE, name="dropout_2")(x)
    x = layers.LayerNormalization(name="layer_norm_2")(x)

    # Extra dense bottleneck before output (more regularization)
    x = layers.Dense(16, activation="relu",
                     kernel_regularizer=regularizers.l2(L2_REG),
                     name="dense_bottleneck")(x)
    x = layers.Dropout(DROPOUT_RATE / 2, name="dropout_3")(x)

    out = layers.Dense(1, activation="sigmoid", name="drought_probability")(x)

    model = keras.Model(inputs=inp, outputs=out, name="AquaGov_LSTM_v2")
    return model


def train(model, X_train, y_train, X_val, y_val):
    print("\n[train-v2] Compiling with Focal Loss + Recall monitoring...")
    model.compile(
        optimizer=keras.optimizers.Adam(
            learning_rate=LEARNING_RATE,
            clipnorm=1.0
        ),
        loss=focal_loss(gamma=2.0, alpha=0.70),
        metrics=[
            "accuracy",
            keras.metrics.AUC(name="auc"),
            keras.metrics.Precision(name="precision", thresholds=THRESHOLD),
            keras.metrics.Recall(name="recall", thresholds=THRESHOLD),
            keras.metrics.AUC(name="auc_pr", curve="PR"),  # AUC-PR better for imbalanced
        ]
    )
    model.summary()

    cb_list = [
        # Monitor RECALL — we cannot afford false negatives
        callbacks.EarlyStopping(
            monitor="val_recall", patience=PATIENCE, mode="max",
            restore_best_weights=True, verbose=1
        ),
        callbacks.ModelCheckpoint(
            filepath=os.path.join(MODELS, "best_model.keras"),
            monitor="val_recall", mode="max", save_best_only=True, verbose=1
        ),
        callbacks.ReduceLROnPlateau(
            monitor="val_recall", factor=0.5, patience=7,
            min_lr=1e-6, mode="max", verbose=1
        ),
        callbacks.CSVLogger(os.path.join(MODELS, "training_log_v2.csv")),
    ]

    # Heavy class weighting: FN (missed drought) costs 3x more than FP
    n_pos = y_train.sum()
    n_neg = len(y_train) - n_pos
    natural_ratio = n_neg / max(n_pos, 1)
    class_weight  = {0: 1.0, 1: max(natural_ratio, DROUGHT_CLASS_WEIGHT)}
    print(f"[train-v2] Class weights: {{0: {class_weight[0]:.2f}, 1: {class_weight[1]:.2f}}}")

    print(f"\n[train-v2] Training up to {EPOCHS} epochs (patience={PATIENCE}, monitor=val_recall)...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        class_weight=class_weight,
        callbacks=cb_list,
        verbose=1
    )
    return history


def evaluate(model, X_test, y_test):
    print("\n[train-v2] Evaluating on test set...")
    y_prob = model.predict(X_test, verbose=0).flatten()
    y_pred = (y_prob >= THRESHOLD).astype(int)

    auc    = roc_auc_score(y_test, y_prob)
    f1     = f1_score(y_test, y_pred, zero_division=0)
    prec   = precision_score(y_test, y_pred, zero_division=0)
    rec    = recall_score(y_test, y_pred, zero_division=0)
    acc    = (y_pred == y_test).mean()
    cm     = confusion_matrix(y_test, y_pred)

    # Train metrics (to check for overfitting)
    y_prob_tr  = model.predict(X_train_global, verbose=0).flatten()
    y_pred_tr  = (y_prob_tr >= THRESHOLD).astype(int)
    acc_tr     = (y_pred_tr == y_train_global).mean()
    rec_tr     = recall_score(y_train_global, y_pred_tr, zero_division=0)
    prec_tr    = precision_score(y_train_global, y_pred_tr, zero_division=0)

    print(f"\n  {'Metric':<18} {'TRAIN':>8} {'TEST':>8}  {'Gap':>7}")
    print(f"  {'-'*50}")
    print(f"  {'Accuracy':<18} {acc_tr:>8.4f} {acc:>8.4f}  {acc-acc_tr:>+7.4f}")
    print(f"  {'Recall':<18} {rec_tr:>8.4f} {rec:>8.4f}  {rec-rec_tr:>+7.4f}")
    print(f"  {'Precision':<18} {prec_tr:>8.4f} {prec:>8.4f}  {prec-prec_tr:>+7.4f}")
    print(f"\n  AUC-ROC   : {auc:.4f}")
    print(f"  F1 Score  : {f1:.4f}")
    print(f"  Threshold : {THRESHOLD} (recall-optimised)")
    print(f"\n  Confusion Matrix:\n{cm}")
    print(f"  TN={cm[0,0]}  FP={cm[0,1]}  FN={cm[1,0]}  TP={cm[1,1]}")
    print(f"\n  ⚠️  False Negatives (missed droughts): {cm[1,0]}")
    print(f"  Classification Report:\n{classification_report(y_test, y_pred, target_names=['No Drought','Drought'])}")

    results = {
        "accuracy":          round(float(acc),  4),
        "auc_roc":           round(float(auc),  4),
        "f1_score":          round(float(f1),   4),
        "precision":         round(float(prec), 4),
        "recall":            round(float(rec),  4),
        "threshold":         THRESHOLD,
        "false_negatives":   int(cm[1, 0]),
        "true_positives":    int(cm[1, 1]),
        "confusion_matrix":  cm.tolist(),
        "train_acc":         round(float(acc_tr), 4),
        "train_recall":      round(float(rec_tr), 4),
        "overfit_acc_gap":   round(float(acc - acc_tr), 4),
        "overfit_recall_gap": round(float(rec - rec_tr), 4),
        "prd_targets": {
            "accuracy_target": 0.80,
            "recall_target":   0.90,
            "accuracy_met":    bool(acc  >= 0.80),
            "recall_met":      bool(rec  >= 0.90),
        }
    }
    return results, y_prob


def plot_training(history, y_test, y_prob):
    hist = history.history
    epochs_ran = range(1, len(hist["loss"]) + 1)

    fig, axes = plt.subplots(1, 4, figsize=(22, 5))
    fig.suptitle("AquaGov LSTM v2 — Training Curves (Recall-Maximized)", fontsize=13, fontweight="bold")

    # Loss
    axes[0].plot(epochs_ran, hist["loss"],     label="Train", color="#2196F3")
    axes[0].plot(epochs_ran, hist["val_loss"], label="Val",   color="#FF5722", linestyle="--")
    axes[0].set_title("Focal Loss")
    axes[0].set_xlabel("Epoch"); axes[0].set_ylabel("Loss")
    axes[0].legend(); axes[0].grid(alpha=0.3)

    # Recall
    axes[1].plot(epochs_ran, hist["recall"],     label="Train Recall", color="#4CAF50")
    axes[1].plot(epochs_ran, hist["val_recall"], label="Val Recall",   color="#FF9800", linestyle="--")
    axes[1].axhline(y=0.90, color="red", linestyle=":", label="Target 90%")
    axes[1].set_title("Recall (Primary Metric)")
    axes[1].set_xlabel("Epoch"); axes[1].set_ylabel("Recall")
    axes[1].legend(); axes[1].grid(alpha=0.3)

    # AUC
    axes[2].plot(epochs_ran, hist["auc"],     label="Train AUC", color="#9C27B0")
    axes[2].plot(epochs_ran, hist["val_auc"], label="Val AUC",   color="#E91E63", linestyle="--")
    axes[2].set_title("AUC-ROC")
    axes[2].set_xlabel("Epoch"); axes[2].legend(); axes[2].grid(alpha=0.3)

    # Precision vs Recall
    axes[3].plot(epochs_ran, hist["precision"],     label="Train Prec", color="#00BCD4")
    axes[3].plot(epochs_ran, hist["val_precision"], label="Val Prec",   color="#009688", linestyle="--")
    axes[3].plot(epochs_ran, hist["recall"],        label="Train Rec",  color="#4CAF50")
    axes[3].plot(epochs_ran, hist["val_recall"],    label="Val Rec",    color="#FF9800", linestyle="--")
    axes[3].set_title("Precision vs Recall")
    axes[3].set_xlabel("Epoch"); axes[3].legend(fontsize=7); axes[3].grid(alpha=0.3)

    plt.tight_layout()
    plt.savefig(os.path.join(MODELS, "training_curve_v2.png"), dpi=150, bbox_inches="tight")
    plt.close()
    print(f"[train-v2] Training curve → models/training_curve_v2.png")

    # Confusion matrix
    y_pred = (y_prob >= THRESHOLD).astype(int)
    cm = confusion_matrix(y_test, y_pred)
    fig2, ax = plt.subplots(figsize=(6, 5))
    im = ax.imshow(cm, cmap="Blues")
    ax.set_xticks([0, 1]); ax.set_yticks([0, 1])
    ax.set_xticklabels(["No Drought", "Drought"])
    ax.set_yticklabels(["No Drought", "Drought"])
    ax.set_xlabel("Predicted"); ax.set_ylabel("Actual")
    ax.set_title(f"Confusion Matrix v2 (threshold={THRESHOLD})")
    for i in range(2):
        for j in range(2):
            color = "white" if cm[i, j] > cm.max() / 2 else "black"
            ax.text(j, i, str(cm[i, j]), ha="center", va="center", fontsize=14, color=color)
    plt.colorbar(im, ax=ax)
    plt.tight_layout()
    plt.savefig(os.path.join(MODELS, "confusion_matrix_v2.png"), dpi=150, bbox_inches="tight")
    plt.close()
    print(f"[train-v2] Confusion matrix → models/confusion_matrix_v2.png")


# Global references needed in evaluate()
X_train_global = None
y_train_global = None


def main():
    global X_train_global, y_train_global
    print("=" * 65)
    print("  AquaGov LSTM Drought Model v2 — Recall-Maximized Training")
    print("=" * 65)

    X_train, y_train, X_val, y_val, X_test, y_test, n_features, window = load_data()
    X_train_global = X_train
    y_train_global = y_train

    model   = build_model(window, n_features)
    history = train(model, X_train, y_train, X_val, y_val)

    # Save history
    hist_dict = {k: [float(v) for v in vals] for k, vals in history.history.items()}
    with open(os.path.join(MODELS, "training_history_v2.json"), "w") as f:
        json.dump(hist_dict, f, indent=2)

    # Evaluate
    results, y_prob = evaluate(model, X_test, y_test)
    with open(os.path.join(MODELS, "evaluation_v2.json"), "w") as f:
        json.dump(results, f, indent=2)

    # Plot
    plot_training(history, y_test, y_prob)

    # Save final model
    final_path = os.path.join(MODELS, "drought_lstm.keras")
    model.save(final_path)
    print(f"\n[train-v2] Final model saved → {final_path}")

    print("\n" + "=" * 65)
    print("  TRAINING COMPLETE — v2 (Recall-Maximized)")
    print("=" * 65)
    print(f"  Accuracy  : {results['accuracy']*100:.2f}%  (target: 80%  {'PASS' if results['prd_targets']['accuracy_met'] else 'FAIL'})")
    print(f"  Recall    : {results['recall']*100:.2f}%  (target: 90%  {'PASS' if results['prd_targets']['recall_met'] else 'FAIL'})")
    print(f"  Precision : {results['precision']*100:.2f}%")
    print(f"  AUC-ROC   : {results['auc_roc']:.4f}")
    print(f"  F1 Score  : {results['f1_score']:.4f}")
    print(f"  Threshold : {THRESHOLD}")
    print(f"\n  Overfitting check:")
    print(f"    Accuracy gap (test-train): {results['overfit_acc_gap']:+.4f}")
    print(f"    Recall gap   (test-train): {results['overfit_recall_gap']:+.4f}")
    print(f"\n  ⚠️  False Negatives (missed droughts): {results['false_negatives']}")


if __name__ == "__main__":
    main()
