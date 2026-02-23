"""
Smart Routing System — AquaGov Tanker Dispatch
===============================================

Endpoints:
  POST   /api/routing/dispatch             – Manual dispatch: authority selects
                                             source + destination, gets a route.
  POST   /api/routing/smart-assign         – Auto-assign: system finds the nearest
                                             available tanker for a destination.
  GET    /api/routing/active-dispatches    – List all live dispatches.
  PATCH  /api/routing/dispatch/{id}/status – Update dispatch status (en_route → completed, etc.)
  DELETE /api/routing/dispatch/{id}        – Cancel a dispatch.
  GET    /api/routing/route                – Quick route preview (no dispatch created).
"""
from __future__ import annotations

import uuid
import math
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from app.schemas import (
    DispatchRouteRequest,
    DispatchRouteResponse,
    SmartAssignRequest,
    SmartAssignResponse,
    ActiveDispatch,
    CompleteDispatchResponse,
    RouteStep,
)
from app.services.maps_service import get_route, get_distance_matrix

router = APIRouter()

# ── In-memory dispatch store ─────────────────────────────────────────────────
# Replace with Supabase table in production.
_ACTIVE_DISPATCHES: dict[str, dict] = {}


# ── Helpers ──────────────────────────────────────────────────────────────────

def _get_tankers() -> list[dict]:
    """Load tankers from Supabase; fall back to mock store in tankers.py."""
    try:
        from app.db import get_supabase
        rows = get_supabase().table("tankers").select("*").execute().data or []
        if rows:
            return rows
    except Exception:
        pass
    # Fallback: read the in-memory mock defined in the tankers route
    from app.routes.tankers import _MOCK_TANKERS
    return _MOCK_TANKERS


def _tanker_by_id(tanker_id: int) -> Optional[dict]:
    return next((t for t in _get_tankers() if t["id"] == tanker_id), None)


def _build_dispatch_response(
    route: dict,
    request: DispatchRouteRequest | None = None,
    *,
    tanker: dict | None = None,
    priority: str = "normal",
    dispatch_id: str | None = None,
    origin_label: str | None = None,
    dest_label: str | None = None,
) -> DispatchRouteResponse:
    """Convert a maps_service route dict into a full DispatchRouteResponse."""
    did = dispatch_id or f"DISP-{uuid.uuid4().hex[:8].upper()}"

    # Clean HTML tags from step instructions (Google Maps returns html_instruction)
    import re
    steps = []
    for s in route.get("steps", []):
        clean_instr = re.sub(r"<[^>]+>", " ", s.get("instruction", "")).strip()
        steps.append(
            RouteStep(
                instruction=clean_instr or "Continue",
                distance_m=int(s.get("distance_m", 0)),
                duration_s=int(s.get("duration_s", 0)),
            )
        )

    return DispatchRouteResponse(
        dispatch_id=did,
        tanker_id=tanker["id"] if tanker else (request.tanker_id if request else None),
        vehicle_number=tanker.get("vehicle_number") if tanker else None,
        driver_name=tanker.get("driver_name") if tanker else None,
        source=route.get("source", "haversine_fallback"),
        distance_km=route["distance_km"],
        duration_min=route["duration_min"],
        fuel_liters_est=route["fuel_liters_est"],
        encoded_polyline=route["encoded_polyline"],
        maps_url=route["maps_url"],
        steps=steps,
        start_address=route.get("start_address", origin_label or ""),
        end_address=route.get("end_address", dest_label or ""),
        priority=priority,
        dispatched_at=datetime.utcnow(),
        status="dispatched",
    )


def _persist_dispatch(resp: DispatchRouteResponse, origin_label: str | None, dest_label: str | None):
    """Store dispatch in the in-memory store (or Supabase if available)."""
    record = resp.model_dump()
    record["origin_label"] = origin_label
    record["dest_label"] = dest_label
    record["dispatched_at"] = record["dispatched_at"].isoformat()
    _ACTIVE_DISPATCHES[resp.dispatch_id] = record

    try:
        from app.db import get_supabase
        get_supabase().table("dispatches").insert(record).execute()
    except Exception:
        pass  # silently use in-memory store


# ── 1. Quick route preview (no dispatch created) ─────────────────────────────

@router.get(
    "/routing/route",
    summary="Preview a route between two coordinates",
    tags=["Routing"],
)
def preview_route(
    origin_lat: float  = Query(..., description="Source latitude"),
    origin_lng: float  = Query(..., description="Source longitude"),
    dest_lat: float    = Query(..., description="Destination latitude"),
    dest_lng: float    = Query(..., description="Destination longitude"),
):
    """
    Returns routing details (distance, ETA, polyline, turn-by-turn steps)
    between two GPS coordinates without creating a dispatch record.
    Ideal for the authority to *preview* a route before confirming.
    """
    route = get_route(origin_lat, origin_lng, dest_lat, dest_lng)
    return {
        "source":           route.get("source", "haversine_fallback"),
        "distance_km":      route["distance_km"],
        "duration_min":     route["duration_min"],
        "fuel_liters_est":  route["fuel_liters_est"],
        "encoded_polyline": route["encoded_polyline"],
        "maps_url":         route["maps_url"],
        "start_address":    route.get("start_address", ""),
        "end_address":      route.get("end_address", ""),
        "steps": [
            {
                "instruction": s.get("instruction", ""),
                "distance_m":  s.get("distance_m", 0),
                "duration_s":  s.get("duration_s", 0),
            }
            for s in route.get("steps", [])
        ],
    }


# ── 2. Manual Dispatch ───────────────────────────────────────────────────────

@router.post(
    "/routing/dispatch",
    response_model=DispatchRouteResponse,
    summary="Dispatch a tanker from source to destination",
    tags=["Routing"],
)
def dispatch_tanker(payload: DispatchRouteRequest):
    """
    Manual dispatch: the authority selects a source point (depot / tanker location)
    and a destination (village / water point), plus optionally a specific tanker.

    - If `tanker_id` is supplied, that tanker is used.
    - If omitted, the route is computed without tanker assignment.
    - Returns turn-by-turn directions, distance, ETA, fuel estimate, and a
      Google Maps deep-link the driver can open.
    """
    # Validate tanker if provided
    tanker = None
    if payload.tanker_id is not None:
        tanker = _tanker_by_id(payload.tanker_id)
        if not tanker:
            raise HTTPException(status_code=404, detail=f"Tanker {payload.tanker_id} not found")
        if tanker.get("status") not in ("active", "loading", "idle"):
            raise HTTPException(
                status_code=400,
                detail=f"Tanker {payload.tanker_id} is in '{tanker['status']}' status and cannot be dispatched",
            )

    # Fetch route from Google Maps / haversine fallback
    route = get_route(
        payload.origin_lat, payload.origin_lng,
        payload.dest_lat,   payload.dest_lng,
    )

    resp = _build_dispatch_response(
        route,
        request=payload,
        tanker=tanker,
        priority=payload.priority,
        origin_label=payload.origin_label,
        dest_label=payload.dest_label,
    )

    # Persist dispatch
    _persist_dispatch(resp, payload.origin_label, payload.dest_label)

    # Update tanker status to "active" / set route_id in DB
    if tanker:
        try:
            from app.db import get_supabase
            get_supabase().table("tankers").update({
                "status":    "active",
                "route_id":  resp.dispatch_id,
                "eta_minutes": resp.duration_min,
            }).eq("id", tanker["id"]).execute()
        except Exception:
            # Update in-memory mock
            from app.routes.tankers import _MOCK_TANKERS
            for t in _MOCK_TANKERS:
                if t["id"] == tanker["id"]:
                    t["status"]      = "active"
                    t["route_id"]    = resp.dispatch_id
                    t["eta_minutes"] = resp.duration_min
                    break

    return resp


# ── 3. Smart Auto-Assign ─────────────────────────────────────────────────────

@router.post(
    "/routing/smart-assign",
    response_model=SmartAssignResponse,
    summary="Auto-find the nearest suitable tanker and dispatch it",
    tags=["Routing"],
)
def smart_assign(payload: SmartAssignRequest):
    """
    Smart dispatch: authority selects the destination; the system:
      1. Fetches all active / idle tankers with enough load.
      2. Calls the Distance Matrix API (or haversine) to find the closest one.
      3. Creates a dispatch automatically.

    Returns the winning dispatch along with how many tankers were evaluated.
    """
    tankers = _get_tankers()

    # Filter: only active or idle tankers with sufficient load
    eligible = [
        t for t in tankers
        if t.get("status") in ("active", "idle", "loading")
        and t.get("current_load_liters", 0) >= payload.required_liters
        and t.get("current_lat") is not None
        and t.get("current_lng") is not None
    ]

    if not eligible:
        raise HTTPException(
            status_code=409,
            detail=(
                f"No tankers available with ≥ {payload.required_liters:,} L load. "
                "Try reducing required_liters or check tanker statuses."
            ),
        )

    # Build origins list for distance matrix
    origins = [(t["current_lat"], t["current_lng"]) for t in eligible]
    dest    = [(payload.dest_lat, payload.dest_lng)]

    matrix = get_distance_matrix(origins, dest)

    # Pick the tanker with shortest distance to destination
    best_idx   = min(range(len(eligible)), key=lambda i: matrix[i][0]["distance_km"])
    best_tanker = eligible[best_idx]

    # Now get full turn-by-turn route for the winner
    route = get_route(
        best_tanker["current_lat"], best_tanker["current_lng"],
        payload.dest_lat,           payload.dest_lng,
    )

    resp = _build_dispatch_response(
        route,
        tanker=best_tanker,
        priority=payload.priority,
        origin_label=f"Tanker {best_tanker['vehicle_number']} current location",
        dest_label=payload.dest_label,
    )

    _persist_dispatch(resp, f"Tanker {best_tanker['vehicle_number']} current location", payload.dest_label)

    # Update tanker status
    try:
        from app.db import get_supabase
        get_supabase().table("tankers").update({
            "status":      "active",
            "route_id":    resp.dispatch_id,
            "eta_minutes": resp.duration_min,
        }).eq("id", best_tanker["id"]).execute()
    except Exception:
        from app.routes.tankers import _MOCK_TANKERS
        for t in _MOCK_TANKERS:
            if t["id"] == best_tanker["id"]:
                t["status"]      = "active"
                t["route_id"]    = resp.dispatch_id
                t["eta_minutes"] = resp.duration_min
                break

    return SmartAssignResponse(
        message=(
            f"Tanker {best_tanker['vehicle_number']} assigned — "
            f"{resp.distance_km} km away, ETA {resp.duration_min} min."
        ),
        dispatch=resp,
        tankers_evaluated=len(eligible),
    )


# ── 4. Active Dispatches ─────────────────────────────────────────────────────

@router.get(
    "/routing/active-dispatches",
    response_model=List[ActiveDispatch],
    summary="List all live (non-completed) dispatch records",
    tags=["Routing"],
)
def list_active_dispatches(
    status: Optional[str] = Query(None, description="Filter by status: dispatched | en_route | completed | cancelled"),
):
    """Return all dispatch records, optionally filtered by status."""
    records = list(_ACTIVE_DISPATCHES.values())

    if status:
        records = [r for r in records if r.get("status") == status]

    # Sort newest first
    records.sort(key=lambda r: r.get("dispatched_at", ""), reverse=True)

    result = []
    for r in records:
        result.append(
            ActiveDispatch(
                dispatch_id=r["dispatch_id"],
                tanker_id=r.get("tanker_id"),
                vehicle_number=r.get("vehicle_number"),
                driver_name=r.get("driver_name"),
                origin_label=r.get("origin_label"),
                dest_label=r.get("dest_label"),
                distance_km=r["distance_km"],
                duration_min=r["duration_min"],
                priority=r["priority"],
                status=r["status"],
                dispatched_at=datetime.fromisoformat(r["dispatched_at"]),
                maps_url=r["maps_url"],
            )
        )
    return result


# ── 5. Update Dispatch Status ────────────────────────────────────────────────

@router.patch(
    "/routing/dispatch/{dispatch_id}/status",
    response_model=CompleteDispatchResponse,
    summary="Update dispatch status (e.g. en_route → completed)",
    tags=["Routing"],
)
def update_dispatch_status(
    dispatch_id: str,
    new_status: str = Query(..., description="One of: dispatched | en_route | completed | cancelled"),
):
    """
    Allows the authority or driver app to update the dispatch lifecycle:
      dispatched → en_route → completed
      or any status → cancelled
    """
    valid = {"dispatched", "en_route", "completed", "cancelled"}
    if new_status not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid}")

    record = _ACTIVE_DISPATCHES.get(dispatch_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Dispatch '{dispatch_id}' not found")

    old_status = record["status"]
    record["status"] = new_status
    _ACTIVE_DISPATCHES[dispatch_id] = record

    # If completed or cancelled, free up the tanker
    if new_status in ("completed", "cancelled") and record.get("tanker_id"):
        try:
            from app.db import get_supabase
            get_supabase().table("tankers").update({
                "status":   "idle",
                "route_id": None,
            }).eq("id", record["tanker_id"]).execute()
        except Exception:
            from app.routes.tankers import _MOCK_TANKERS
            for t in _MOCK_TANKERS:
                if t["id"] == record["tanker_id"]:
                    t["status"]   = "idle"
                    t["route_id"] = None
                    break

    return CompleteDispatchResponse(
        dispatch_id=dispatch_id,
        status=new_status,
        message=f"Dispatch {dispatch_id} updated from '{old_status}' → '{new_status}'",
    )


# ── 6. Cancel / Delete Dispatch ──────────────────────────────────────────────

@router.delete(
    "/routing/dispatch/{dispatch_id}",
    response_model=CompleteDispatchResponse,
    summary="Cancel and remove a dispatch",
    tags=["Routing"],
)
def cancel_dispatch(dispatch_id: str):
    """Cancel a dispatch (sets status to 'cancelled') and frees the assigned tanker."""
    record = _ACTIVE_DISPATCHES.get(dispatch_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Dispatch '{dispatch_id}' not found")

    record["status"] = "cancelled"

    if record.get("tanker_id"):
        try:
            from app.db import get_supabase
            get_supabase().table("tankers").update({
                "status":   "idle",
                "route_id": None,
            }).eq("id", record["tanker_id"]).execute()
        except Exception:
            from app.routes.tankers import _MOCK_TANKERS
            for t in _MOCK_TANKERS:
                if t["id"] == record["tanker_id"]:
                    t["status"]   = "idle"
                    t["route_id"] = None
                    break

    _ACTIVE_DISPATCHES[dispatch_id] = record

    return CompleteDispatchResponse(
        dispatch_id=dispatch_id,
        status="cancelled",
        message=f"Dispatch {dispatch_id} cancelled successfully",
    )
