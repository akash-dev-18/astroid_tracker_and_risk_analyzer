from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.watchlist import WatchlistCreate, WatchlistUpdate, WatchlistResponse
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app import crud

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])


@router.get("", response_model=List[WatchlistResponse])
async def get_user_watchlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.watchlist.get_by_user(db, user_id=current_user.id)


@router.post("", response_model=WatchlistResponse, status_code=status.HTTP_201_CREATED)
async def add_to_watchlist(data: WatchlistCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    asteroid = crud.asteroid.get(db, id=data.asteroid_id)
    if not asteroid:
        raise HTTPException(status_code=404, detail=f"Asteroid {data.asteroid_id} not found")
    
    existing = crud.watchlist.get_by_user_and_asteroid(db, user_id=current_user.id, asteroid_id=data.asteroid_id)
    if existing:
        raise HTTPException(status_code=400, detail="Asteroid already in your watchlist")
    
    return crud.watchlist.create(db, user_id=current_user.id, asteroid_id=data.asteroid_id, alert_distance_km=data.alert_distance_km)


@router.put("/{asteroid_id}", response_model=WatchlistResponse)
async def update_watchlist_entry(asteroid_id: str, data: WatchlistUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = crud.watchlist.get_by_user_and_asteroid(db, user_id=current_user.id, asteroid_id=asteroid_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Watchlist entry not found")
    return crud.watchlist.update(db, db_obj=entry, obj_in=data)


@router.delete("/{asteroid_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_watchlist(asteroid_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = crud.watchlist.get_by_user_and_asteroid(db, user_id=current_user.id, asteroid_id=asteroid_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Watchlist entry not found")
    crud.watchlist.remove(db, id=entry.id)


@router.get("/count")
async def get_watchlist_count(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return {"count": crud.watchlist.count_by_user(db, user_id=current_user.id)}
