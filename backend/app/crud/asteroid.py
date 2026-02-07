from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import Optional, List
from datetime import date
from app.models.asteroid import Asteroid
from app.models.close_approach import CloseApproach


class CRUDAsteroid:
    def get(self, db: Session, id: str) -> Optional[Asteroid]:
        return db.query(Asteroid).options(joinedload(Asteroid.close_approaches)).filter(Asteroid.id == id).first()

    def get_feed(
        self, db: Session, *, start_date: date, end_date: date,
        is_hazardous: Optional[bool] = None, min_diameter: Optional[float] = None,
        max_diameter: Optional[float] = None, sort_by: str = "approach_date",
        limit: int = 50, offset: int = 0
    ) -> List[Asteroid]:
        query = db.query(Asteroid).join(Asteroid.close_approaches).filter(
            CloseApproach.approach_date >= start_date,
            CloseApproach.approach_date <= end_date
        )
        
        if is_hazardous is not None:
            query = query.filter(Asteroid.is_hazardous == is_hazardous)
        if min_diameter is not None:
            query = query.filter(Asteroid.estimated_diameter_max >= min_diameter)
        if max_diameter is not None:
            query = query.filter(Asteroid.estimated_diameter_min <= max_diameter)
        
        if sort_by == "diameter":
            query = query.order_by(Asteroid.estimated_diameter_max.desc())
        elif sort_by == "velocity":
            query = query.order_by(CloseApproach.velocity_kmh.desc())
        else:
            query = query.order_by(CloseApproach.approach_date.asc())
        
        return query.distinct().options(joinedload(Asteroid.close_approaches)).offset(offset).limit(limit).all()

    def search(self, db: Session, *, query: str, limit: int = 20) -> List[Asteroid]:
        return db.query(Asteroid).options(joinedload(Asteroid.close_approaches)).filter(
            or_(Asteroid.name.ilike(f"%{query}%"), Asteroid.id.ilike(f"%{query}%"))
        ).limit(limit).all()

    def get_hazardous(self, db: Session, limit: int = 50) -> List[Asteroid]:
        return db.query(Asteroid).options(joinedload(Asteroid.close_approaches)).filter(
            Asteroid.is_hazardous == True
        ).limit(limit).all()

    def create(self, db: Session, *, asteroid_data: dict) -> Asteroid:
        db_obj = Asteroid(
            id=asteroid_data["id"], name=asteroid_data["name"],
            absolute_magnitude=asteroid_data.get("absolute_magnitude"),
            is_hazardous=asteroid_data.get("is_hazardous", False),
            estimated_diameter_min=asteroid_data.get("estimated_diameter_min"),
            estimated_diameter_max=asteroid_data.get("estimated_diameter_max"),
            nasa_jpl_url=asteroid_data.get("nasa_jpl_url")
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def upsert(self, db: Session, *, asteroid_data: dict) -> Asteroid:
        existing = db.query(Asteroid).filter(Asteroid.id == asteroid_data["id"]).first()
        if existing:
            existing.name = asteroid_data["name"]
            existing.absolute_magnitude = asteroid_data.get("absolute_magnitude")
            existing.is_hazardous = asteroid_data.get("is_hazardous", False)
            existing.estimated_diameter_min = asteroid_data.get("estimated_diameter_min")
            existing.estimated_diameter_max = asteroid_data.get("estimated_diameter_max")
            existing.nasa_jpl_url = asteroid_data.get("nasa_jpl_url")
            db.commit()
            db.refresh(existing)
            return existing
        return self.create(db, asteroid_data=asteroid_data)


asteroid = CRUDAsteroid()
