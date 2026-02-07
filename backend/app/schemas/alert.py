from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class AlertResponse(BaseModel):
    id: int
    user_id: int
    asteroid_id: str
    message: str
    alert_type: str
    is_read: bool
    approach_date: Optional[datetime] = None
    created_at: datetime
    asteroid_name: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class AlertUpdate(BaseModel):
    is_read: Optional[bool] = None
