from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date, datetime, timedelta
from app.models.close_approach import CloseApproach


class CRUDCloseApproach:
    def get(self, db: Session, id: int) -> Optional[CloseApproach]:
        return db.query(CloseApproach).filter(CloseApproach.id == id).first()

    def get_by_asteroid(self, db: Session, *, asteroid_id: str) -> List[CloseApproach]:
        return db.query(CloseApproach).filter(CloseApproach.asteroid_id == asteroid_id).order_by(CloseApproach.approach_date.asc()).all()

    def get_by_date_range(self, db: Session, *, start_date: date, end_date: date) -> List[CloseApproach]:
        return db.query(CloseApproach).filter(
            CloseApproach.approach_date >= start_date, CloseApproach.approach_date <= end_date
        ).order_by(CloseApproach.approach_date.asc()).all()

    def get_upcoming(self, db: Session, *, days: int = 7, limit: int = 50) -> List[CloseApproach]:
        today = date.today()
        future = today + timedelta(days=days)
        return db.query(CloseApproach).filter(
            CloseApproach.approach_date >= today, CloseApproach.approach_date <= future
        ).order_by(CloseApproach.approach_date.asc()).limit(limit).all()

    def create(self, db: Session, *, asteroid_id: str, approach_data: dict) -> CloseApproach:
        approach_date = approach_data.get("approach_date")
        if isinstance(approach_date, str):
            approach_date = datetime.strptime(approach_date, "%Y-%m-%d").date()
        
        db_obj = CloseApproach(
            asteroid_id=asteroid_id, approach_date=approach_date,
            approach_date_full=approach_data.get("approach_date_full"),
            velocity_kmh=approach_data.get("velocity_kmh"),
            miss_distance_km=approach_data.get("miss_distance_km"),
            miss_distance_lunar=approach_data.get("miss_distance_lunar"),
            orbiting_body=approach_data.get("orbiting_body", "Earth")
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def upsert(self, db: Session, *, asteroid_id: str, approach_data: dict) -> CloseApproach:
        approach_date = approach_data.get("approach_date")
        if isinstance(approach_date, str):
            approach_date = datetime.strptime(approach_date, "%Y-%m-%d").date()
        
        existing = db.query(CloseApproach).filter(
            CloseApproach.asteroid_id == asteroid_id, CloseApproach.approach_date == approach_date
        ).first()
        
        if existing:
            existing.approach_date_full = approach_data.get("approach_date_full")
            existing.velocity_kmh = approach_data.get("velocity_kmh")
            existing.miss_distance_km = approach_data.get("miss_distance_km")
            existing.miss_distance_lunar = approach_data.get("miss_distance_lunar")
            existing.orbiting_body = approach_data.get("orbiting_body", "Earth")
            db.commit()
            db.refresh(existing)
            return existing
        return self.create(db, asteroid_id=asteroid_id, approach_data=approach_data)


close_approach = CRUDCloseApproach()
