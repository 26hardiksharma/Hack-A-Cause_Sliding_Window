"""
Drought Prediction Routes
POST /api/predict              – single district prediction
POST /api/predict/batch        – multi-district batch
GET  /api/predict/latest       – latest stored predictions from Supabase
GET  /api/predict/{district_id} – latest prediction for a specific district
"""
from __future__ import annotations
from datetime import datetime
from typing import List, Optional
import asyncio

from fastapi import APIRouter, HTTPException, Query
from app.schemas import (
    PredictionInput, PredictionResult,
    BatchPredictionRequest, BatchPredictionResponse,
    prob_to_risk,
)
from app.ml.predictor import predict_single, predict_batch, get_model_version

router = APIRouter()


def _save_predictions(rows: list[dict]):
    """Persist prediction rows to Supabase (best-effort, silent on error)."""
    try:
        from app.db import get_supabase
        sb = get_supabase()
        sb.table("predictions").insert(rows).execute()
    except Exception as e:
        print(f"[predictions] Supabase save skipped: {e}")


@router.post("/predict", response_model=PredictionResult)
def predict(payload: PredictionInput):
    """Run LSTM inference for a single district observation and persist to DB."""
    result = predict_single(
        rainfall    = payload.rainfall,
        temperature = payload.temperature,
        humidity    = payload.humidity,
        rain_7d     = payload.rain_7d,
        rain_30d    = payload.rain_30d,
        district_id = payload.district_id,
    )
    predicted_at = datetime.utcnow()
    # Persist to Supabase
    _save_predictions([{
        "district_id":   payload.district_id,
        "district_name": payload.district_name,
        "drought_prob":  result["drought_prob"],
        "risk_level":    result["risk_level"],
        "horizon_days":  7,
        "model_version": get_model_version(),
        "predicted_at":  predicted_at.isoformat(),
    }])
    return PredictionResult(
        district_id   = payload.district_id,
        district_name = payload.district_name,
        drought_prob  = result["drought_prob"],
        risk_level    = result["risk_level"],
        predicted_at  = predicted_at,
        horizon_days  = 7,
    )


@router.post("/predict/batch", response_model=BatchPredictionResponse)
def predict_batch_route(payload: BatchPredictionRequest):
    """Run LSTM batch inference for multiple districts and persist all to DB."""
    records = [d.model_dump() for d in payload.districts]
    results = predict_batch(records)
    predicted_at = datetime.utcnow()

    predictions = [
        PredictionResult(
            district_id   = payload.districts[i].district_id,
            district_name = payload.districts[i].district_name,
            drought_prob  = results[i]["drought_prob"],
            risk_level    = results[i]["risk_level"],
            predicted_at  = predicted_at,
            horizon_days  = 7,
        )
        for i in range(len(results))
    ]

    # Persist all predictions to Supabase
    _save_predictions([
        {
            "district_id":   payload.districts[i].district_id,
            "district_name": payload.districts[i].district_name,
            "drought_prob":  results[i]["drought_prob"],
            "risk_level":    results[i]["risk_level"],
            "horizon_days":  7,
            "model_version": get_model_version(),
            "predicted_at":  predicted_at.isoformat(),
        }
        for i in range(len(results))
    ])

    return BatchPredictionResponse(
        predictions   = predictions,
        model_version = get_model_version(),
        generated_at  = predicted_at,
    )


@router.get("/predict/latest", response_model=List[PredictionResult])
def get_latest_predictions(limit: int = Query(default=10, le=50)):
    """
    Return the most recent predictions from Supabase.
    If Supabase is not configured, returns mock predictions.
    """
    try:
        from app.db import get_supabase
        sb = get_supabase()
        resp = (
            sb.table("predictions")
            .select("*")
            .order("predicted_at", desc=True)
            .limit(limit)
            .execute()
        )
        rows = resp.data or []
        return [
            PredictionResult(
                district_id  = r["district_id"],
                district_name = r.get("district_name"),
                drought_prob = r["drought_prob"],
                risk_level   = r["risk_level"],
                predicted_at = r["predicted_at"],
                horizon_days = r.get("horizon_days", 7),
            )
            for r in rows
        ]
    except Exception:
        # Return synthetic demo data when DB not configured
        return _demo_predictions()


@router.get("/predict/{district_id}", response_model=PredictionResult)
def get_district_prediction(district_id: int):
    """Get latest prediction for a specific district."""
    try:
        from app.db import get_supabase
        sb = get_supabase()
        resp = (
            sb.table("predictions")
            .select("*")
            .eq("district_id", district_id)
            .order("predicted_at", desc=True)
            .limit(1)
            .execute()
        )
        if not resp.data:
            raise HTTPException(status_code=404, detail="No prediction found")
        r = resp.data[0]
        return PredictionResult(
            district_id  = r["district_id"],
            district_name = r.get("district_name"),
            drought_prob = r["drought_prob"],
            risk_level   = r["risk_level"],
            predicted_at = r["predicted_at"],
            horizon_days = r.get("horizon_days", 7),
        )
    except HTTPException:
        raise
    except Exception:
        # Fallback demo
        demo = _demo_predictions()
        match = next((p for p in demo if p.district_id == district_id), demo[0])
        return match


def _demo_predictions() -> List[PredictionResult]:
    """Synthetic demo predictions for hackathon demo mode."""
    import random
    random.seed(42)
    DISTRICTS_DEMO = [
        (1,  "Beed",       0.52),
        (2,  "Latur",      0.68),
        (3,  "Osmanabad",  0.45),
        (4,  "Solapur",    0.73),
        (5,  "Aurangabad", 0.38),
        (6,  "Nanded",     0.29),
        (7,  "Jalgaon",    0.18),
        (8,  "Buldhana",   0.55),
        (9,  "Washim",     0.41),
        (10, "Yavatmal",   0.62),
    ]
    return [
        PredictionResult(
            district_id  = did,
            district_name = name,
            drought_prob = prob,
            risk_level   = prob_to_risk(prob),
            predicted_at = datetime.utcnow(),
            horizon_days = 7,
        )
        for did, name, prob in DISTRICTS_DEMO
    ]
