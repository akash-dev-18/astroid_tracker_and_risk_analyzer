from sqlalchemy import Column, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Asteroid(Base):
    __tablename__ = "asteroids"
    
    id = Column(String(20), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    absolute_magnitude = Column(Float, nullable=True)
    is_hazardous = Column(Boolean, default=False, index=True)
    estimated_diameter_min = Column(Float, nullable=True)
    estimated_diameter_max = Column(Float, nullable=True)
    nasa_jpl_url = Column(String(500), nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    close_approaches = relationship("CloseApproach", back_populates="asteroid", cascade="all, delete-orphan")
    watchlist_entries = relationship("Watchlist", back_populates="asteroid", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="asteroid", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Asteroid(id={self.id}, name={self.name}, hazardous={self.is_hazardous})>"
