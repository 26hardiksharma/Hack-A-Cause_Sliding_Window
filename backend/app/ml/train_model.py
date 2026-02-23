"""
LSTM Drought Prediction Model – training script.
Architecture: LSTM(50) → LSTM(50) → Dense(1, sigmoid)
Input:  30-day sequences of [rainfall, temperature, humidity, rain_7d, rain_30d]
Output: drought probability (0–1) for the next 7 days

Run: python -m app.ml.train_model
"""
import os
import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score

# Lazy imports to avoid loading TF if not training
def _train():
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense, Dropout
    from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

    DATA_PATH   = "app/ml/data/drought_synthetic.csv"
    MODEL_PATH  = os.getenv("MODEL_PATH", "app/ml/model.h5")
    SCALER_PATH = os.getenv("SCALER_PATH", "app/ml/scaler.pkl")
    SEQ_LEN     = 30
    FEATURES    = ["rainfall", "temperature", "humidity", "rain_7d", "rain_30d"]

    print("📂 Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    df = df.sort_values(["district_id", "date"]).reset_index(drop=True)

    print("🔧 Scaling features...")
    scaler = MinMaxScaler()
    df[FEATURES] = scaler.fit_transform(df[FEATURES])

    # Save scaler
    os.makedirs(os.path.dirname(SCALER_PATH), exist_ok=True)
    with open(SCALER_PATH, "wb") as f:
        pickle.dump(scaler, f)
    print(f"  Scaler saved → {SCALER_PATH}")

    # Build sequences per district
    X, y = [], []
    for district_id, grp in df.groupby("district_id"):
        feat_arr   = grp[FEATURES].values
        target_arr = grp["is_drought"].values
        for i in range(SEQ_LEN, len(feat_arr)):
            X.append(feat_arr[i - SEQ_LEN : i])
            y.append(target_arr[i])

    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.float32)

    print(f"  X shape: {X.shape}, y shape: {y.shape}")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42, stratify=y
    )

    # ── Model architecture ────────────────────────────────────────────────────
    print("🏗  Building LSTM model...")
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(SEQ_LEN, len(FEATURES))),
        Dropout(0.2),
        LSTM(50),
        Dropout(0.2),
        Dense(1, activation="sigmoid"),
    ])
    model.compile(
        optimizer="adam",
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    callbacks = [
        EarlyStopping(patience=5, restore_best_weights=True, monitor="val_loss"),
        ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor="val_loss"),
    ]

    print("🏋  Training...")
    model.fit(
        X_train, y_train,
        validation_split=0.15,
        epochs=50,
        batch_size=64,
        callbacks=callbacks,
        verbose=1,
    )

    # ── Evaluation ─────────────────────────────────────────────────────────────
    print("📊 Evaluating...")
    y_pred_prob = model.predict(X_test, verbose=0).flatten()
    y_pred = (y_pred_prob >= 0.5).astype(int)
    acc  = accuracy_score(y_test, y_pred)
    f1   = f1_score(y_test, y_pred)
    print(f"  Accuracy : {acc:.4f}")
    print(f"  F1 Score : {f1:.4f}")
    print(f"✅ Model saved → {MODEL_PATH}")
    return acc, f1


if __name__ == "__main__":
    # Generate data first if missing
    if not os.path.exists("app/ml/data/drought_synthetic.csv"):
        from app.ml.generate_data import generate
        generate()
    _train()
