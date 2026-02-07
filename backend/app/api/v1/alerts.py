from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.alert import AlertResponse
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app import crud

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=List[AlertResponse])
async def get_user_alerts(
    unread_only: bool = Query(False), limit: int = Query(50, le=100), offset: int = Query(0),
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    alerts = crud.alert.get_by_user(db, user_id=current_user.id, unread_only=unread_only, limit=limit, offset=offset)
    return [{
        "id": a.id, "user_id": a.user_id, "asteroid_id": a.asteroid_id, "message": a.message,
        "alert_type": a.alert_type, "is_read": a.is_read, "approach_date": a.approach_date,
        "created_at": a.created_at, "asteroid_name": a.asteroid.name if a.asteroid else None
    } for a in alerts]


@router.get("/unread/count")
async def get_unread_count(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return {"unread_count": crud.alert.count_unread(db, user_id=current_user.id)}


@router.put("/{alert_id}/read", response_model=AlertResponse)
async def mark_as_read(alert_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    alert = crud.alert.get(db, id=alert_id)
    if not alert or alert.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    updated = crud.alert.update(db, db_obj=alert, obj_in={"is_read": True})
    return {
        "id": updated.id, "user_id": updated.user_id, "asteroid_id": updated.asteroid_id, "message": updated.message,
        "alert_type": updated.alert_type, "is_read": updated.is_read, "approach_date": updated.approach_date,
        "created_at": updated.created_at, "asteroid_name": updated.asteroid.name if updated.asteroid else None
    }


@router.put("/read-all")
async def mark_all_read(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    count = crud.alert.mark_all_as_read(db, user_id=current_user.id)
    return {"message": f"Marked {count} alerts as read"}


@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_alert(alert_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    alert = crud.alert.get(db, id=alert_id)
    if not alert or alert.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Alert not found")
    crud.alert.remove(db, id=alert_id)
