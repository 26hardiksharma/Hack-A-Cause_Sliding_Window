"""
GET /api/health  – liveness + model status
"""
from fastapi import APIRouter
from datetime import datetime
from app.ml.predictor import get_model_version

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "AquaGov ML Microservice",
        "model_version": get_model_version(),
        "timestamp": datetime.utcnow().isoformat(),
    }
