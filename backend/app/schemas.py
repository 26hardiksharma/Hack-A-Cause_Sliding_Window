"""
Pydantic models / schemas shared across the API.
"""
from __future__ import annotations
from datetime import datetime
from typing import Literal, Optional, List
from pydantic import BaseModel, Field


# ── Risk level ────────────────────────────────────────────────────────────────
RiskLevel = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]


def prob_to_risk(prob: float) -> RiskLevel:
    if prob >= 0.70:
        return "CRITICAL"
    elif prob >= 0.40:
        return "HIGH"
    elif prob >= 0.20:
        return "MEDIUM"
    return "LOW"


# ── District ──────────────────────────────────────────────────────────────────
class DistrictBase(BaseModel):
    name: str
    state: str = "Maharashtra"
    pincode: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


class DistrictCreate(DistrictBase):
    pass


class District(DistrictBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Prediction ────────────────────────────────────────────────────────────────
class PredictionInput(BaseModel):
    district_id: int
    rainfall: float = Field(..., ge=0, description="mm")
    temperature: float = Field(..., description="°C")
    humidity: float = Field(..., ge=0, le=100, description="%")
    rain_7d: float = Field(..., ge=0, description="Rolling 7-day rainfall mm")
    rain_30d: float = Field(..., ge=0, description="Rolling 30-day rainfall mm")


class PredictionResult(BaseModel):
    district_id: int
    district_name: Optional[str] = None
    drought_prob: float = Field(..., ge=0.0, le=1.0)
    risk_level: RiskLevel
    predicted_at: datetime
    horizon_days: int = 7


class BatchPredictionRequest(BaseModel):
    districts: List[PredictionInput]


class BatchPredictionResponse(BaseModel):
    predictions: List[PredictionResult]
    model_version: str
    generated_at: datetime


# ── SMS Alert ─────────────────────────────────────────────────────────────────
class SMSAlertRequest(BaseModel):
    district_ids: List[int] = Field(default_factory=list)
    target_group: Literal["farmers", "authorities", "all"] = "all"
    message: str = Field(..., max_length=160)
    template: Optional[str] = None


class SMSAlertResponse(BaseModel):
    queued: int
    sent: int
    failed: int
    campaign_id: Optional[str] = None
    message: str


class SMSRegisterRequest(BaseModel):
    """Represents an inbound SMS registration (JOIN <PINCODE>)."""
    phone: str
    body: str          # e.g. "JOIN 413001"


# ── Tanker ────────────────────────────────────────────────────────────────────
class TankerStatus(BaseModel):
    id: int
    vehicle_number: str
    driver_name: str
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    status: Literal["active", "loading", "maintenance", "idle"]
    capacity_liters: int
    current_load_liters: int
    route_id: Optional[str] = None
    eta_minutes: Optional[int] = None
    district_id: Optional[int] = None


class TankerUpdate(BaseModel):
    status: Optional[Literal["active", "loading", "maintenance", "idle"]] = None
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    route_id: Optional[str] = None
    eta_minutes: Optional[int] = None


class RouteOptimizationRequest(BaseModel):
    district_ids: List[int]
    available_tanker_ids: List[int]


class RouteOptimizationResponse(BaseModel):
    routes: List[dict]
    total_tankers: int
    estimated_coverage: float


# ── Route Optimization & Prediction ───────────────────────────────────────────
class TankerRequirementPrediction(BaseModel):
    district_id: int
    population: int
    water_per_capita_liters: int = 40
    drought_prob: float
    required_liters: float
    estimated_tankers_required: int


class RouteStep(BaseModel):
    instruction: str
    distance_m: int
    duration_s: int


class DispatchRouteRequest(BaseModel):
    """Authority selects a tanker dispatch location and a destination."""
    tanker_id: Optional[int] = Field(None, description="Tanker to dispatch; omit to let the system auto-assign")
    origin_lat: float  = Field(..., description="Dispatch (source) latitude")
    origin_lng: float  = Field(..., description="Dispatch (source) longitude")
    origin_label: Optional[str] = Field(None, description="Human-readable depot / village name")
    dest_lat: float    = Field(..., description="Destination latitude")
    dest_lng: float    = Field(..., description="Destination longitude")
    dest_label: Optional[str] = Field(None, description="Human-readable destination name")
    priority: Literal["normal", "urgent", "critical"] = "normal"
    notes: Optional[str] = None


class DispatchRouteResponse(BaseModel):
    dispatch_id: str
    tanker_id: Optional[int]
    vehicle_number: Optional[str]
    driver_name: Optional[str]
    source: Literal["google_maps", "haversine_fallback"]
    distance_km: float
    duration_min: int
    fuel_liters_est: float
    encoded_polyline: str
    maps_url: str
    steps: List[RouteStep]
    start_address: str
    end_address: str
    priority: str
    dispatched_at: datetime
    status: Literal["dispatched", "en_route", "completed", "cancelled"] = "dispatched"


class SmartAssignRequest(BaseModel):
    """
    Given a destination and optionally a district / urgency hint,
    the system finds the best available tanker (nearest + adequate load)
    and auto-dispatches it.
    """
    dest_lat: float
    dest_lng: float
    dest_label: Optional[str] = None
    required_liters: int = Field(5000, ge=1000, description="Minimum load required")
    priority: Literal["normal", "urgent", "critical"] = "normal"
    notes: Optional[str] = None


class SmartAssignResponse(BaseModel):
    message: str
    dispatch: DispatchRouteResponse
    tankers_evaluated: int


class ActiveDispatch(BaseModel):
    dispatch_id: str
    tanker_id: Optional[int]
    vehicle_number: Optional[str]
    driver_name: Optional[str]
    origin_label: Optional[str]
    dest_label: Optional[str]
    distance_km: float
    duration_min: int
    priority: str
    status: str
    dispatched_at: datetime
    maps_url: str


class CompleteDispatchResponse(BaseModel):
    dispatch_id: str
    status: str
    message: str


# ── User ──────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: str
    role: Literal["admin", "dwo", "block_manager", "operator", "viewer"]
    region: Optional[str] = None
    phone: Optional[str] = None


class User(UserCreate):
    id: int
    status: Literal["active", "inactive"] = "active"
    created_at: datetime
    last_active: Optional[datetime] = None

    class Config:
        from_attributes = True
