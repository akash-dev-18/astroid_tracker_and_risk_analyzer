from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Watchlist(Base):
    __tablename__ = "watchlist"
    __table_args__ = (UniqueConstraint('user_id', 'asteroid_id', name='unique_user_asteroid'),)
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    asteroid_id = Column(String(20), ForeignKey("asteroids.id"), nullable=False, index=True)
    alert_distance_km = Column(Float, default=1000000.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="watchlist")
    asteroid = relationship("Asteroid", back_populates="watchlist_entries")
    
    def __repr__(self):
        return f"<Watchlist(user={self.user_id}, asteroid={self.asteroid_id})>"
