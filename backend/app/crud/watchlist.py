from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from app.models.watchlist import Watchlist


class CRUDWatchlist:
    def get(self, db: Session, id: int) -> Optional[Watchlist]:
        return db.query(Watchlist).filter(Watchlist.id == id).first()

    def get_by_user(self, db: Session, *, user_id: int) -> List[Watchlist]:
        return db.query(Watchlist).options(joinedload(Watchlist.asteroid)).filter(
            Watchlist.user_id == user_id
        ).order_by(Watchlist.created_at.desc()).all()

    def get_by_user_and_asteroid(self, db: Session, *, user_id: int, asteroid_id: str) -> Optional[Watchlist]:
        return db.query(Watchlist).filter(
            Watchlist.user_id == user_id, Watchlist.asteroid_id == asteroid_id
        ).first()

    def get_all(self, db: Session) -> List[Watchlist]:
        return db.query(Watchlist).options(joinedload(Watchlist.asteroid)).all()

    def count_by_user(self, db: Session, *, user_id: int) -> int:
        return db.query(Watchlist).filter(Watchlist.user_id == user_id).count()

    def create(self, db: Session, *, user_id: int, asteroid_id: str, alert_distance_km: float = 1000000.0) -> Watchlist:
        db_obj = Watchlist(user_id=user_id, asteroid_id=asteroid_id, alert_distance_km=alert_distance_km)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Watchlist, obj_in: dict) -> Watchlist:
        if hasattr(obj_in, "dict"):
            update_data = obj_in.dict(exclude_unset=True)
        else:
            update_data = obj_in
        for field, value in update_data.items():
            if value is not None:
                setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> None:
        obj = db.query(Watchlist).filter(Watchlist.id == id).first()
        if obj:
            db.delete(obj)
            db.commit()


watchlist = CRUDWatchlist()
