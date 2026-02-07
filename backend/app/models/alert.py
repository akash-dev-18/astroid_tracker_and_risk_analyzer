from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    asteroid_id = Column(String(20), ForeignKey("asteroids.id"), nullable=False, index=True)
    message = Column(String(500), nullable=False)
    alert_type = Column(String(50), default="close_approach")
    is_read = Column(Boolean, default=False, index=True)
    approach_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="alerts")
    asteroid = relationship("Asteroid", back_populates="alerts")
    
    def __repr__(self):
        return f"<Alert(id={self.id}, user={self.user_id}, read={self.is_read})>"
