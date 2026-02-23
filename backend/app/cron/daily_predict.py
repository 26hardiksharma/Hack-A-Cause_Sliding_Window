"""
Cron Job – Daily Drought Prediction Pipeline
Runs at 6 AM daily (or manually via: python -m app.cron.daily_predict)

Flow:
  1. Fetch latest climate readings per district (or use synthetic data)
  2. Run LSTM inference via /api/predict/batch
  3. Persist predictions to Supabase
  4. Trigger SMS alerts for districts crossing risk thresholds
"""
import os
import httpx
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

API_BASE = os.getenv("AQUAGOV_API_URL", "http://localhost:8000/api")

# Latest synthetic climate conditions per district (demo data)
DISTRICT_CONDITIONS = [
    {"district_id": 1,  "district_name": "Beed",       "rainfall": 5.0,  "temperature": 38.5, "humidity": 30.0, "rain_7d": 12.0, "rain_30d": 42.0},
    {"district_id": 2,  "district_name": "Latur",      "rainfall": 1.2,  "temperature": 41.0, "humidity": 22.0, "rain_7d": 5.0,  "rain_30d": 20.0},
    {"district_id": 3,  "district_name": "Osmanabad",  "rainfall": 8.5,  "temperature": 36.0, "humidity": 35.0, "rain_7d": 20.0, "rain_30d": 65.0},
    {"district_id": 4,  "district_name": "Solapur",    "rainfall": 0.5,  "temperature": 42.0, "humidity": 18.0, "rain_7d": 3.0,  "rain_30d": 15.0},
    {"district_id": 5,  "district_name": "Aurangabad", "rainfall": 12.0, "temperature": 34.5, "humidity": 42.0, "rain_7d": 30.0, "rain_30d": 95.0},
    {"district_id": 6,  "district_name": "Nanded",     "rainfall": 15.0, "temperature": 33.0, "humidity": 48.0, "rain_7d": 40.0, "rain_30d": 120.0},
    {"district_id": 7,  "district_name": "Jalgaon",    "rainfall": 20.0, "temperature": 31.0, "humidity": 55.0, "rain_7d": 55.0, "rain_30d": 160.0},
    {"district_id": 8,  "district_name": "Buldhana",   "rainfall": 4.0,  "temperature": 39.0, "humidity": 28.0, "rain_7d": 10.0, "rain_30d": 35.0},
    {"district_id": 9,  "district_name": "Washim",     "rainfall": 7.0,  "temperature": 37.0, "humidity": 38.0, "rain_7d": 18.0, "rain_30d": 58.0},
    {"district_id": 10, "district_name": "Yavatmal",   "rainfall": 2.0,  "temperature": 40.5, "humidity": 24.0, "rain_7d": 7.0,  "rain_30d": 28.0},
]

# SMS thresholds: send alert when risk crosses these levels
ALERT_RISK_LEVELS = {"HIGH", "CRITICAL"}


def run_pipeline():
    print(f"\n{'='*60}")
    print(f"  AquaGov Daily Prediction Pipeline – {datetime.utcnow().isoformat()}")
    print(f"{'='*60}")

    # ── Step 1: Batch prediction ──────────────────────────────────────────────
    print("\n[1/3] Running LSTM batch prediction...")
    try:
        resp = httpx.post(
            f"{API_BASE}/predict/batch",
            json={"districts": DISTRICT_CONDITIONS},
            timeout=30.0,
        )
        resp.raise_for_status()
        batch = resp.json()
        predictions = batch["predictions"]
        print(f"  ✅ {len(predictions)} predictions generated (model: {batch['model_version']})")
    except Exception as exc:
        print(f"  ❌ Batch prediction failed: {exc}")
        return

    # ── Step 2: Persist to Supabase ───────────────────────────────────────────
    print("\n[2/3] Persisting predictions to Supabase...")
    try:
        from app.db import get_supabase
        sb = get_supabase()
        rows = [
            {
                "district_id":   p["district_id"],
                "district_name": p.get("district_name"),
                "drought_prob":  p["drought_prob"],
                "risk_level":    p["risk_level"],
                "horizon_days":  p.get("horizon_days", 7),
                "model_version": batch["model_version"],
                "predicted_at":  batch["generated_at"],
            }
            for p in predictions
        ]
        sb.table("predictions").insert(rows).execute()
        print(f"  ✅ {len(rows)} rows saved to Supabase")
    except Exception as exc:
        print(f"  ⚠️  Supabase persist failed (continuing): {exc}")

    # ── Step 3: Trigger SMS for critical/high risk districts ──────────────────
    print("\n[3/3] Checking for SMS alerts...")
    alert_districts = [
        p for p in predictions
        if p["risk_level"] in ALERT_RISK_LEVELS
    ]
    print(f"  Districts requiring alerts: {len(alert_districts)}")

    for pred in alert_districts:
        name  = pred.get("district_name", f"District {pred['district_id']}")
        level = pred["risk_level"]
        prob  = round(pred["drought_prob"] * 100, 1)
        msg   = (
            f"⚠ DROUGHT ALERT [{level}]: {name} district shows {prob}% drought risk. "
            f"Water conservation is advised. - AquaGov"
        )
        try:
            r = httpx.post(
                f"{API_BASE}/sms/send",
                json={
                    "district_ids": [pred["district_id"]],
                    "target_group": "all",
                    "message": msg,
                },
                timeout=20.0,
            )
            r.raise_for_status()
            sms_resp = r.json()
            print(f"  📱 {name}: {sms_resp.get('sent',0)} SMS sent (risk={level})")
        except Exception as exc:
            print(f"  ⚠️  SMS for {name} failed: {exc}")

    print(f"\n✅ Pipeline complete at {datetime.utcnow().isoformat()}\n")


if __name__ == "__main__":
    run_pipeline()
