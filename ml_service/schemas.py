"""
Pydantic Schemas — AquaGov ML Service
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


# ── Input schemas ─────────────────────────────────────────────────────────────

class PredictRequest(BaseModel):
    """Single village prediction from a raw 30-day sequence."""
    village_id: str = Field(..., example="VLG0001")
    sequence:   list[list[float]] = Field(
        ...,
        description=(
            "30 rows × 8 features: "
            "[rainfall_mm, rain_7d, rain_30d, temp_max_c, "
            "humidity_pct, gw_depth_m, availability_frac, spi_approx]"
        )
    )

    @field_validator("sequence")
    @classmethod
    def validate_sequence(cls, v):
        if len(v) != 30:
            raise ValueError(f"Sequence must have exactly 30 rows, got {len(v)}")
        for i, row in enumerate(v):
            if len(row) != 8:
                raise ValueError(f"Row {i} must have 8 features, got {len(row)}")
        return v


class BatchPredictRequest(BaseModel):
    """Batch prediction for multiple villages at once."""
    villages: list[PredictRequest]


class LiveDataRequest(BaseModel):
    """
    Thin request for live prediction from recent sensor readings.
    The API will auto-construct the 30-day window from the latest
    available synthetic data + any overrides provided here.
    """
    village_id:         str
    rainfall_override:  Optional[float] = None  # mm today
    gw_depth_override:  Optional[float] = None  # m today
    month:              Optional[int]   = None   # 1-12, defaults to current month


# ── Output schemas ────────────────────────────────────────────────────────────

class PredictionResult(BaseModel):
    village_id:          str
    drought_probability: float
    risk_level:          str      # LOW / MEDIUM / HIGH / CRITICAL
    risk_color:          str      # hex color for heatmap
    inference_ms:        float
    predicted_at:        str      # ISO timestamp


class BatchPredictionResult(BaseModel):
    predictions:   list[PredictionResult]
    total_ms:      float
    villages_count: int


class VillageRiskMapItem(BaseModel):
    village_id:          str
    village_name:        str
    latitude:            float
    longitude:           float
    drought_probability: float
    risk_level:          str
    risk_color:          str
    stress_tier:         str
    population:          int


class RiskMapResponse(BaseModel):
    timestamp:        str
    villages:         list[VillageRiskMapItem]
    summary: dict  # { LOW: n, MEDIUM: n, HIGH: n, CRITICAL: n }


class HealthResponse(BaseModel):
    status:       str
    model_loaded: bool
    model_metrics: dict
    feature_names: list[str]
    window_size:   int
    version:       str
    uptime_s:      float


class RiskLevelDef(BaseModel):
    level:      str
    min_prob:   float
    max_prob:   float
    color:      str
    label:      str
    sms_trigger: bool
