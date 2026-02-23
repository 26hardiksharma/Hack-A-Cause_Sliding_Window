"""
Tanker Fleet Routes
GET  /api/tankers              – list all tankers with live status
GET  /api/tankers/{id}         – single tanker detail
PATCH /api/tankers/{id}        – update tanker status/location
POST /api/tankers/optimize     – run route optimization
GET  /api/tankers/feed         – live event feed (polling)
"""
from __future__ import annotations
import random
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from app.schemas import TankerStatus, TankerUpdate, RouteOptimizationRequest, RouteOptimizationResponse

router = APIRouter()

# ── In-memory tanker store (replace with Supabase in production) ───────────────
random.seed(99)
_MOCK_TANKERS: list[dict] = [
    {
        "id":                  i,
        "vehicle_number":      f"MH-14-AB-{1200 + i}",
        "driver_name":         [
            "Suresh Kumar", "Rajiv Nair", "Amit Patil",
            "Dinesh Yadav", "Prashant More", "Vinod Shinde",
        ][i % 6],
        "current_lat":         18.99 + random.uniform(-0.5, 0.5),
        "current_lng":         75.76 + random.uniform(-0.5, 0.5),
        "status":              random.choice(["active", "active", "active", "loading", "maintenance"]),
        "capacity_liters":     10000,
        "current_load_liters": random.randint(3000, 10000),
        "route_id":            f"R-{i:02d}" if i % 5 != 0 else None,
        "eta_minutes":         random.randint(5, 90),
        "district_id":         (i % 10) + 1,
        "last_updated":        datetime.utcnow().isoformat(),
    }
    for i in range(1, 25)
]
_MOCK_FEED: list[dict] = [
    {"type": "delivery", "title": "Route R-07 Complete", "detail": "10,000L delivered to Manwat.", "time": "2m ago"},
    {"type": "breakdown", "title": "Breakdown Alert",    "detail": "Engine overheat near Selu Village.", "time": "15m ago"},
    {"type": "loading",   "title": "Loading Started",    "detail": "Route R-12 filling at East Depot.", "time": "45m ago"},
]


def _db_tankers_or_mock() -> list[dict]:
    try:
        from app.db import get_supabase
        rows = get_supabase().table("tankers").select("*").execute().data or []
        if rows:
            return rows
    except Exception:
        pass
    return _MOCK_TANKERS


@router.get("/tankers", response_model=List[TankerStatus])
def list_tankers():
    rows = _db_tankers_or_mock()
    return [TankerStatus(**_coerce(r)) for r in rows]


@router.get("/tankers/feed")
def live_feed():
    """Recent tanker events for the Live Feed panel."""
    return {"feed": _MOCK_FEED, "timestamp": datetime.utcnow().isoformat()}


@router.get("/tankers/{tanker_id}", response_model=TankerStatus)
def get_tanker(tanker_id: int):
    rows = _db_tankers_or_mock()
    tanker = next((r for r in rows if r["id"] == tanker_id), None)
    if not tanker:
        raise HTTPException(status_code=404, detail="Tanker not found")
    return TankerStatus(**_coerce(tanker))


@router.patch("/tankers/{tanker_id}", response_model=TankerStatus)
def update_tanker(tanker_id: int, payload: TankerUpdate):
    """Update tanker status / GPS location."""
    rows = _db_tankers_or_mock()
    tanker = next((r for r in rows if r["id"] == tanker_id), None)
    if not tanker:
        raise HTTPException(status_code=404, detail="Tanker not found")

    updates = payload.model_dump(exclude_none=True)
    updates["last_updated"] = datetime.utcnow().isoformat()

    try:
        from app.db import get_supabase
        get_supabase().table("tankers").update(updates).eq("id", tanker_id).execute()
    except Exception:
        # Update in-memory mock
        for t in _MOCK_TANKERS:
            if t["id"] == tanker_id:
                t.update(updates)
                break

    tanker.update(updates)
    return TankerStatus(**_coerce(tanker))


@router.post("/tankers/optimize", response_model=RouteOptimizationResponse)
def optimize_routes(payload: RouteOptimizationRequest):
    """
    Simple greedy route optimization:
    Assign highest-VWSI districts to available tankers first.
    In production, integrate Google Maps Directions API here.
    """
    from app.routes.districts import _DEMO_VWSI

    # Sort districts by risk (highest first)
    sorted_districts = sorted(
        payload.district_ids,
        key=lambda did: _DEMO_VWSI.get(did, 0.3),
        reverse=True,
    )

    routes = []
    for i, did in enumerate(sorted_districts):
        if i >= len(payload.available_tanker_ids):
            break
        tid = payload.available_tanker_ids[i]
        routes.append({
            "tanker_id":   tid,
            "district_id": did,
            "priority":    i + 1,
            "eta_minutes": 20 + i * 15,
            "maps_link":   f"https://maps.app.goo.gl/demo{did}{tid}",
        })

    coverage = len(routes) / len(payload.district_ids) * 100 if payload.district_ids else 0
    return RouteOptimizationResponse(
        routes            = routes,
        total_tankers     = len(routes),
        estimated_coverage = round(coverage, 1),
    )


def _coerce(d: dict) -> dict:
    """Ensure dict matches TankerStatus fields."""
    defaults = {
        "current_lat": None, "current_lng": None,
        "route_id": None, "eta_minutes": None, "district_id": None,
    }
    return {**defaults, **d}
