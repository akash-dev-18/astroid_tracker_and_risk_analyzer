from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date, datetime


class CloseApproachBase(BaseModel):
    approach_date: date
    approach_date_full: Optional[datetime] = None
    velocity_kmh: Optional[float] = None
    miss_distance_km: Optional[float] = None
    miss_distance_lunar: Optional[float] = None
    orbiting_body: str = "Earth"


class CloseApproachResponse(CloseApproachBase):
    id: int
    asteroid_id: str
    
    model_config = ConfigDict(from_attributes=True)


class AsteroidBase(BaseModel):
    id: str
    name: str
    absolute_magnitude: Optional[float] = None
    is_hazardous: bool = False
    estimated_diameter_min: Optional[float] = None
    estimated_diameter_max: Optional[float] = None
    nasa_jpl_url: Optional[str] = None


class AsteroidResponse(AsteroidBase):
    last_updated: Optional[datetime] = None
    close_approaches: List[CloseApproachResponse] = []
    risk_score: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class AsteroidFeedResponse(BaseModel):
    count: int
    asteroids: List[AsteroidResponse]
