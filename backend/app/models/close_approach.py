from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class CloseApproach(Base):
    __tablename__ = "close_approaches"
    
    id = Column(Integer, primary_key=True, index=True)
    asteroid_id = Column(String(20), ForeignKey("asteroids.id"), nullable=False, index=True)
    approach_date = Column(Date, nullable=False, index=True)
    approach_date_full = Column(DateTime, nullable=True)
    velocity_kmh = Column(Float, nullable=True)
    miss_distance_km = Column(Float, nullable=True)
    miss_distance_lunar = Column(Float, nullable=True)
    orbiting_body = Column(String(50), default="Earth")
    
    asteroid = relationship("Asteroid", back_populates="close_approaches")
    
    def __repr__(self):
        return f"<CloseApproach(asteroid={self.asteroid_id}, date={self.approach_date})>"
