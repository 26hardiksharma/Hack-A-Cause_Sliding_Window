"""
District Routes
GET  /api/districts               list all districts with latest VWSI
GET  /api/districts/{id}          single district detail
GET  /api/districts/{id}/history  historical VWSI trend (7 or 30 days)
"""
from __future__ import annotations
import json
import os
from datetime import datetime, timedelta
from typing import List
import random

from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

# Load static district metadata
_DISTRICTS_META: list[dict] = []
_META_PATH = "app/ml/data/districts.json"
if os.path.exists(_META_PATH):
    with open(_META_PATH) as f:
        _DISTRICTS_META = json.load(f)
else:
    _DISTRICTS_META = [
        {"id": 1,  "name": "Beed",       "lat": 18.99, "lng": 75.76},
        {"id": 2,  "name": "Latur",      "lat": 18.40, "lng": 76.56},
        {"id": 3,  "name": "Osmanabad",  "lat": 18.18, "lng": 76.04},
        {"id": 4,  "name": "Solapur",    "lat": 17.68, "lng": 75.90},
        {"id": 5,  "name": "Aurangabad", "lat": 19.88, "lng": 75.33},
        {"id": 6,  "name": "Nanded",     "lat": 19.16, "lng": 77.31},
        {"id": 7,  "name": "Jalgaon",    "lat": 21.00, "lng": 75.56},
        {"id": 8,  "name": "Buldhana",   "lat": 20.53, "lng": 76.18},
        {"id": 9,  "name": "Washim",     "lat": 20.11, "lng": 77.13},
        {"id": 10, "name": "Yavatmal",   "lat": 20.39, "lng": 78.12},
    ]

# Pre-computed synthetic VWSI per district for demo
_DEMO_VWSI = {
    1: 0.52, 2: 0.68, 3: 0.45, 4: 0.73,
    5: 0.38, 6: 0.29, 7: 0.18, 8: 0.55,
    9: 0.41, 10: 0.62,
}
_DEMO_VILLAGES = {
    1: 12, 2: 27, 3: 8, 4: 31, 5: 14, 6: 7, 7: 5, 8: 18, 9: 9, 10: 23,
}
_RISK_MAP = {
    "LOW": "LOW", "MEDIUM": "MEDIUM", "HIGH": "HIGH", "CRITICAL": "CRITICAL",
}


def _risk_from_vwsi(v: float) -> str:
    if v >= 0.70: return "CRITICAL"
    if v >= 0.40: return "HIGH"
    if v >= 0.20: return "MEDIUM"
    return "LOW"


@router.get("/districts")
def list_districts():
    """All districts with current VWSI / risk level."""
    try:
        from app.db import get_supabase
        sb = get_supabase()
        preds = (
            sb.table("predictions")
            .select("district_id, drought_prob, risk_level, predicted_at")
            .order("predicted_at", desc=True)
            .execute()
        ).data or []

        latest: dict[int, dict] = {}
        for p in preds:
            did = p["district_id"]
            if did not in latest:
                latest[did] = p

        districts = []
        for d in _DISTRICTS_META:
            pred = latest.get(d["id"], {})
            vwsi = pred.get("drought_prob", _DEMO_VWSI.get(d["id"], 0.3))
            districts.append({
                **d,
                "vwsi": vwsi,
                "risk_level": pred.get("risk_level", _risk_from_vwsi(vwsi)),
                "villages_under_stress": _DEMO_VILLAGES.get(d["id"], 5),
                "last_updated": pred.get("predicted_at", datetime.utcnow().isoformat()),
            })
        return {"districts": districts, "total": len(districts)}

    except Exception:
        # Fallback demo
        districts = [
            {
                **d,
                "vwsi": _DEMO_VWSI.get(d["id"], 0.3),
                "risk_level": _risk_from_vwsi(_DEMO_VWSI.get(d["id"], 0.3)),
                "villages_under_stress": _DEMO_VILLAGES.get(d["id"], 5),
                "last_updated": datetime.utcnow().isoformat(),
            }
            for d in _DISTRICTS_META
        ]
        return {"districts": districts, "total": len(districts)}


@router.get("/districts/{district_id}")
def get_district(district_id: int):
    """Single district details."""
    meta = next((d for d in _DISTRICTS_META if d["id"] == district_id), None)
    if not meta:
        raise HTTPException(status_code=404, detail="District not found")

    vwsi = _DEMO_VWSI.get(district_id, 0.3)
    return {
        **meta,
        "vwsi": vwsi,
        "risk_level": _risk_from_vwsi(vwsi),
        "villages_under_stress": _DEMO_VILLAGES.get(district_id, 5),
        "active_tankers": random.randint(1, 6),
        "last_updated": datetime.utcnow().isoformat(),
    }


@router.get("/districts/{district_id}/history")
def get_district_history(
    district_id: int,
    days: int = Query(default=7, ge=1, le=30),
):
    """Historical VWSI trend for chart rendering."""
    meta = next((d for d in _DISTRICTS_META if d["id"] == district_id), None)
    if not meta:
        raise HTTPException(status_code=404, detail="District not found")

    try:
        from app.db import get_supabase
        sb = get_supabase()
        cutoff = (datetime.utcnow() - timedelta(days=days)).isoformat()
        rows = (
            sb.table("predictions")
            .select("drought_prob, predicted_at")
            .eq("district_id", district_id)
            .gte("predicted_at", cutoff)
            .order("predicted_at")
            .execute()
        ).data or []
        if rows:
            return {
                "district_id": district_id,
                "history": [
                    {"date": r["predicted_at"][:10], "vwsi": r["drought_prob"]}
                    for r in rows
                ],
            }
    except Exception:
        pass

    # Synthetic history fallback
    base   = _DEMO_VWSI.get(district_id, 0.3)
    random.seed(district_id)
    history = []
    for i in range(days):
        date_str = (datetime.utcnow() - timedelta(days=days - i)).strftime("%Y-%m-%d")
        trend    = base - (days - i) * 0.008
        noise    = random.uniform(-0.03, 0.03)
        history.append({"date": date_str, "vwsi": round(max(0.05, trend + noise), 3)})

    return {"district_id": district_id, "history": history}
