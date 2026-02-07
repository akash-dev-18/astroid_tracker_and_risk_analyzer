from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class WatchlistCreate(BaseModel):
    asteroid_id: str
    alert_distance_km: float = Field(default=1000000.0, gt=0)


class WatchlistUpdate(BaseModel):
    alert_distance_km: Optional[float] = Field(None, gt=0)


class WatchlistResponse(BaseModel):
    id: int
    user_id: int
    asteroid_id: str
    alert_distance_km: float
    created_at: datetime
    asteroid_name: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)
