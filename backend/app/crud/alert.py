from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from datetime import datetime
from app.models.alert import Alert


class CRUDAlert:
    def get(self, db: Session, id: int) -> Optional[Alert]:
        return db.query(Alert).options(joinedload(Alert.asteroid)).filter(Alert.id == id).first()

    def get_by_user(self, db: Session, *, user_id: int, unread_only: bool = False, limit: int = 50, offset: int = 0) -> List[Alert]:
        query = db.query(Alert).options(joinedload(Alert.asteroid)).filter(Alert.user_id == user_id)
        if unread_only:
            query = query.filter(Alert.is_read == False)
        return query.order_by(Alert.created_at.desc()).offset(offset).limit(limit).all()

    def get_by_user_asteroid_date(self, db: Session, *, user_id: int, asteroid_id: str, approach_date: datetime) -> Optional[Alert]:
        return db.query(Alert).filter(
            Alert.user_id == user_id, Alert.asteroid_id == asteroid_id, Alert.approach_date == approach_date
        ).first()

    def count_unread(self, db: Session, *, user_id: int) -> int:
        return db.query(Alert).filter(Alert.user_id == user_id, Alert.is_read == False).count()

    def create(self, db: Session, *, user_id: int, asteroid_id: str, message: str, alert_type: str = "close_approach", approach_date: datetime = None) -> Alert:
        db_obj = Alert(user_id=user_id, asteroid_id=asteroid_id, message=message, alert_type=alert_type, approach_date=approach_date)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Alert, obj_in: dict) -> Alert:
        for field, value in obj_in.items():
            if value is not None:
                setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def mark_all_as_read(self, db: Session, *, user_id: int) -> int:
        result = db.query(Alert).filter(Alert.user_id == user_id, Alert.is_read == False).update({"is_read": True})
        db.commit()
        return result

    def remove(self, db: Session, *, id: int) -> None:
        obj = db.query(Alert).filter(Alert.id == id).first()
        if obj:
            db.delete(obj)
            db.commit()


alert = CRUDAlert()
