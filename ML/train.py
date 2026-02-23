"""
LSTM Drought Model Training — AquaGov
======================================
Architecture:  LSTM(50) -> Dropout(0.2) -> LSTM(50) -> Dropout(0.2) -> Dense(1, sigmoid)
Input shape:   (batch, 30, 8)   — 30-day window, 8 features
Output:        drought probability in [0, 1]
Loss:          binary_crossentropy
Metrics:       accuracy, AUC (ROC), precision, recall, F1

Risk level mapping (inference):
    prob > 0.70  ->  CRITICAL  (red)
    prob > 0.40  ->  HIGH      (orange)
    prob > 0.20  ->  MEDIUM    (yellow)
    prob <= 0.20 ->  LOW       (green)

Outputs (saved to ML/models/):
    drought_lstm.keras    — final trained model
    best_model.keras      — best checkpoint (val_auc)
    training_history.json — epoch-by-epoch metrics
    evaluation.json       — final test-set metrics
    training_curve.png    — loss / accuracy / AUC plots
    confusion_matrix.png  — test set confusion matrix
"""

import os
import json
import numpy as np
import matplotlib
matplotlib.use("Agg")   # non-interactive backend; safe on headless servers
import matplotlib.pyplot as plt

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"   # suppress TF C++ info/warnings

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, callbacks, regularizers
from sklearn.metrics import (
    classification_report, confusion_matrix,
    roc_auc_score, f1_score, precision_score, recall_score
)

# ── paths ─────────────────────────────────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
PROCESSED = os.path.join(BASE_DIR, "processed")
MODELS    = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS, exist_ok=True)

SEED = 42
tf.random.set_seed(SEED)
np.random.seed(SEED)

# ── hyperparameters ───────────────────────────────────────────────────────────
LSTM_UNITS_1    = 50
LSTM_UNITS_2    = 50
DROPOUT_RATE    = 0.2
L2_REG          = 1e-4
LEARNING_RATE   = 1e-3
BATCH_SIZE      = 64
EPOCHS          = 60
PATIENCE        = 10          # EarlyStopping patience
THRESHOLD       = 0.40        # classification threshold (matches PRD HIGH)


# ═══════════════════════════════════════════════════════════════════════════════
# 1. Load data
# ═══════════════════════════════════════════════════════════════════════════════

def load_data():
    print("[train] Loading preprocessed arrays...")
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
    print(f"  Class balance — train: {y_train.mean()*100:.1f}% drought")
    return X_train, y_train, X_val, y_val, X_test, y_test, n_features, window


# ═══════════════════════════════════════════════════════════════════════════════
# 2. Build model
# ═══════════════════════════════════════════════════════════════════════════════

def build_model(window, n_features):
    """
    LSTM(50) -> Dropout -> LSTM(50) -> Dropout -> Dense(1)
    Exactly matching PRD spec with added regularisation for robustness.
    """
    inp = keras.Input(shape=(window, n_features), name="sequence_input")

    x = layers.LSTM(
        LSTM_UNITS_1,
        return_sequences=True,
        kernel_regularizer=regularizers.l2(L2_REG),
        name="lstm_1"
    )(inp)
    x = layers.Dropout(DROPOUT_RATE, name="dropout_1")(x)

    x = layers.LSTM(
        LSTM_UNITS_2,
        return_sequences=False,
        kernel_regularizer=regularizers.l2(L2_REG),
        name="lstm_2"
    )(x)
    x = layers.Dropout(DROPOUT_RATE, name="dropout_2")(x)

    out = layers.Dense(1, activation="sigmoid", name="drought_probability")(x)

    model = keras.Model(inputs=inp, outputs=out, name="AquaGov_LSTM")
    return model


# ═══════════════════════════════════════════════════════════════════════════════
# 3. Train
# ═══════════════════════════════════════════════════════════════════════════════

def train(model, X_train, y_train, X_val, y_val):
    print("\n[train] Compiling model...")
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss="binary_crossentropy",
        metrics=[
            "accuracy",
            keras.metrics.AUC(name="auc"),
            keras.metrics.Precision(name="precision"),
            keras.metrics.Recall(name="recall"),
        ]
    )
    model.summary()

    cb_list = [
        callbacks.EarlyStopping(
            monitor="val_auc", patience=PATIENCE, mode="max",
            restore_best_weights=True, verbose=1
        ),
        callbacks.ModelCheckpoint(
            filepath=os.path.join(MODELS, "best_model.keras"),
            monitor="val_auc", mode="max", save_best_only=True, verbose=1
        ),
        callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=5,
            min_lr=1e-6, verbose=1
        ),
        callbacks.CSVLogger(os.path.join(MODELS, "training_log.csv")),
    ]

    # Class weights to handle any residual imbalance
    n_pos = y_train.sum()
    n_neg = len(y_train) - n_pos
    class_weight = {0: 1.0, 1: n_neg / max(n_pos, 1)}
    print(f"[train] Class weights: {{0: {class_weight[0]:.2f}, 1: {class_weight[1]:.2f}}}")

    print(f"\n[train] Training for up to {EPOCHS} epochs (patience={PATIENCE})...")
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


# ═══════════════════════════════════════════════════════════════════════════════
# 4. Evaluate
# ═══════════════════════════════════════════════════════════════════════════════

def evaluate(model, X_test, y_test):
    print("\n[train] Evaluating on test set...")
    y_prob = model.predict(X_test, verbose=0).flatten()
    y_pred = (y_prob >= THRESHOLD).astype(int)

    auc    = roc_auc_score(y_test, y_prob)
    f1     = f1_score(y_test, y_pred)
    prec   = precision_score(y_test, y_pred)
    rec    = recall_score(y_test, y_pred)
    acc    = (y_pred == y_test).mean()
    cm     = confusion_matrix(y_test, y_pred)

    print(f"\n  Accuracy  : {acc*100:.2f}%")
    print(f"  AUC-ROC   : {auc:.4f}")
    print(f"  F1 Score  : {f1:.4f}")
    print(f"  Precision : {prec:.4f}")
    print(f"  Recall    : {rec:.4f}")
    print(f"\n  Confusion Matrix:\n{cm}")
    print(f"\n  Classification Report:\n{classification_report(y_test, y_pred, target_names=['No Drought','Drought'])}")

    results = {
        "accuracy":         round(float(acc),  4),
        "auc_roc":          round(float(auc),  4),
        "f1_score":         round(float(f1),   4),
        "precision":        round(float(prec), 4),
        "recall":           round(float(rec),  4),
        "threshold":        THRESHOLD,
        "confusion_matrix": cm.tolist(),
        "prd_targets": {
            "accuracy_target": 0.85,
            "f1_target":       0.80,
            "accuracy_met":    bool(acc >= 0.85),   # cast numpy bool_ -> Python bool
            "f1_met":          bool(f1  >= 0.80),
        }
    }
    return results, y_prob


# ═══════════════════════════════════════════════════════════════════════════════
# 5. Plot training curves
# ═══════════════════════════════════════════════════════════════════════════════

def plot_training(history, y_test, y_prob):
    hist = history.history
    epochs_ran = range(1, len(hist["loss"]) + 1)

    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    fig.suptitle("AquaGov LSTM — Training Curves", fontsize=14, fontweight="bold")

    # Loss
    axes[0].plot(epochs_ran, hist["loss"],     label="Train Loss", color="#2196F3")
    axes[0].plot(epochs_ran, hist["val_loss"], label="Val Loss",   color="#FF5722", linestyle="--")
    axes[0].set_title("Binary Cross-Entropy Loss")
    axes[0].set_xlabel("Epoch")
    axes[0].set_ylabel("Loss")
    axes[0].legend()
    axes[0].grid(alpha=0.3)

    # Accuracy
    axes[1].plot(epochs_ran, [v*100 for v in hist["accuracy"]],     label="Train Acc", color="#4CAF50")
    axes[1].plot(epochs_ran, [v*100 for v in hist["val_accuracy"]], label="Val Acc",   color="#FF9800", linestyle="--")
    axes[1].axhline(y=85, color="red", linestyle=":", linewidth=1.5, label="PRD Target 85%")
    axes[1].set_title("Accuracy (%)")
    axes[1].set_xlabel("Epoch")
    axes[1].set_ylabel("Accuracy (%)")
    axes[1].legend()
    axes[1].grid(alpha=0.3)

    # AUC
    axes[2].plot(epochs_ran, hist["auc"],     label="Train AUC", color="#9C27B0")
    axes[2].plot(epochs_ran, hist["val_auc"], label="Val AUC",   color="#E91E63", linestyle="--")
    axes[2].axhline(y=0.90, color="red", linestyle=":", linewidth=1.5, label="Excellent (0.90)")
    axes[2].set_title("AUC-ROC")
    axes[2].set_xlabel("Epoch")
    axes[2].set_ylabel("AUC")
    axes[2].legend()
    axes[2].grid(alpha=0.3)

    plt.tight_layout()
    plot_path = os.path.join(MODELS, "training_curve.png")
    plt.savefig(plot_path, dpi=150, bbox_inches="tight")
    print(f"[train] Training curve saved -> {plot_path}")
    plt.close()

    # Confusion matrix
    cm = confusion_matrix(y_test, (y_prob >= THRESHOLD).astype(int))
    fig2, ax = plt.subplots(figsize=(6, 5))
    im = ax.imshow(cm, cmap="Blues")
    ax.set_xticks([0, 1]); ax.set_yticks([0, 1])
    ax.set_xticklabels(["No Drought", "Drought"])
    ax.set_yticklabels(["No Drought", "Drought"])
    ax.set_xlabel("Predicted"); ax.set_ylabel("Actual")
    ax.set_title("Confusion Matrix — Test Set")
    for i in range(2):
        for j in range(2):
            ax.text(j, i, str(cm[i, j]), ha="center", va="center",
                    color="white" if cm[i, j] > cm.max()/2 else "black", fontsize=14)
    plt.colorbar(im, ax=ax)
    plt.tight_layout()
    cm_path = os.path.join(MODELS, "confusion_matrix.png")
    plt.savefig(cm_path, dpi=150, bbox_inches="tight")
    print(f"[train] Confusion matrix saved -> {cm_path}")
    plt.close()


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    print("=" * 60)
    print("  AquaGov LSTM Drought Model — Training Pipeline")
    print("=" * 60)

    # Load
    X_train, y_train, X_val, y_val, X_test, y_test, n_features, window = load_data()

    # Build
    model = build_model(window, n_features)

    # Train
    history = train(model, X_train, y_train, X_val, y_val)

    # Save history
    history_dict = {k: [float(v) for v in vals] for k, vals in history.history.items()}
    with open(os.path.join(MODELS, "training_history.json"), "w") as f:
        json.dump(history_dict, f, indent=2)

    # Evaluate
    results, y_prob = evaluate(model, X_test, y_test)
    with open(os.path.join(MODELS, "evaluation.json"), "w") as f:
        json.dump(results, f, indent=2)

    # Plot
    plot_training(history, y_test, y_prob)

    # Save final model
    final_path = os.path.join(MODELS, "drought_lstm.keras")
    model.save(final_path)
    print(f"\n[train] Final model saved -> {final_path}")

    # Summary
    print("\n" + "=" * 60)
    print("  TRAINING COMPLETE")
    print("=" * 60)
    print(f"  Accuracy  : {results['accuracy']*100:.2f}%  (PRD target: 85%  {'PASS' if results['prd_targets']['accuracy_met'] else 'FAIL'})")
    print(f"  AUC-ROC   : {results['auc_roc']:.4f}")
    print(f"  F1 Score  : {results['f1_score']:.4f}  (PRD target: 0.80  {'PASS' if results['prd_targets']['f1_met'] else 'FAIL'})")
    print(f"  Precision : {results['precision']:.4f}")
    print(f"  Recall    : {results['recall']:.4f}")
    print("\n  Artifacts in ML/models/:")
    print("    drought_lstm.keras      <- final model for FastAPI serving")
    print("    best_model.keras        <- best checkpoint (val_auc)")
    print("    training_curve.png")
    print("    confusion_matrix.png")
    print("    evaluation.json")
    print("    training_history.json")
    print("    training_log.csv")


if __name__ == "__main__":
    main()
