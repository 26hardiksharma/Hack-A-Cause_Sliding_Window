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
