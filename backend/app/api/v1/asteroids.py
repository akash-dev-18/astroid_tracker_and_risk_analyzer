from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date, timedelta
from app.schemas.asteroid import AsteroidResponse, AsteroidFeedResponse
from app.api.deps import get_db
from app import crud
from app.services.risk_service import calculate_risk_score
from app.services.nasa_service import nasa_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/asteroids", tags=["Asteroids"])


@router.get("/feed", response_model=AsteroidFeedResponse)
async def get_asteroid_feed(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    is_hazardous: Optional[bool] = Query(None),
    min_diameter: Optional[float] = Query(None),
    max_diameter: Optional[float] = Query(None),
    sort_by: Optional[str] = Query("approach_date"),
    limit: int = Query(50, le=100),
    offset: int = Query(0),
    db: Session = Depends(get_db)
):
    if not start_date:
        start_date = date.today()
    if not end_date:
        end_date = start_date + timedelta(days=7)
    
    if end_date < start_date:
        raise HTTPException(status_code=400, detail="end_date must be after start_date")
    
    asteroids = crud.asteroid.get_feed(
        db, start_date=start_date, end_date=end_date, is_hazardous=is_hazardous,
        min_diameter=min_diameter, max_diameter=max_diameter, sort_by=sort_by, limit=limit, offset=offset
    )
    
    response_asteroids = []
    for asteroid in asteroids:
        asteroid_dict = {
            "id": asteroid.id, "name": asteroid.name, "absolute_magnitude": asteroid.absolute_magnitude,
            "is_hazardous": asteroid.is_hazardous, "estimated_diameter_min": asteroid.estimated_diameter_min,
            "estimated_diameter_max": asteroid.estimated_diameter_max, "nasa_jpl_url": asteroid.nasa_jpl_url,
            "last_updated": asteroid.last_updated, "close_approaches": asteroid.close_approaches, "risk_score": None
        }
        if asteroid.close_approaches:
            closest = min(asteroid.close_approaches, key=lambda x: x.miss_distance_km if x.miss_distance_km else float('inf'))
            asteroid_dict["risk_score"] = calculate_risk_score(asteroid, closest)
        response_asteroids.append(asteroid_dict)
    
    return {"count": len(response_asteroids), "asteroids": response_asteroids}


@router.get("/search", response_model=List[AsteroidResponse])
async def search_asteroids(q: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    asteroids = crud.asteroid.search(db, query=q)
    for asteroid in asteroids:
        if asteroid.close_approaches:
            closest = min(asteroid.close_approaches, key=lambda x: x.miss_distance_km if x.miss_distance_km else float('inf'))
            asteroid.risk_score = calculate_risk_score(asteroid, closest)
    return asteroids


@router.get("/hazardous", response_model=List[AsteroidResponse])
async def get_hazardous_asteroids(limit: int = Query(50, le=100), db: Session = Depends(get_db)):
    asteroids = crud.asteroid.get_hazardous(db, limit=limit)
    for asteroid in asteroids:
        if asteroid.close_approaches:
            closest = min(asteroid.close_approaches, key=lambda x: x.miss_distance_km if x.miss_distance_km else float('inf'))
            asteroid.risk_score = calculate_risk_score(asteroid, closest)
    return asteroids


@router.get("/{asteroid_id}", response_model=AsteroidResponse)
async def get_asteroid_by_id(asteroid_id: str, db: Session = Depends(get_db)):
    asteroid = crud.asteroid.get(db, id=asteroid_id)
    if not asteroid:
        raise HTTPException(status_code=404, detail=f"Asteroid with ID {asteroid_id} not found")
    
    if asteroid.close_approaches:
        today = date.today()
        future = [a for a in asteroid.close_approaches if a.approach_date >= today]
        approach = min(future, key=lambda x: x.approach_date) if future else asteroid.close_approaches[0]
        asteroid.risk_score = calculate_risk_score(asteroid, approach)
    return asteroid


@router.post("/sync")
async def sync_nasa_data(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    if not start_date:
        start_date = date.today()
    if not end_date:
        end_date = start_date + timedelta(days=7)
    
    try:
        response = await nasa_service.fetch_feed(start_date, end_date)
        asteroids_data = nasa_service.parse_feed_response(response)
        
        count = 0
        for data in asteroids_data:
            asteroid = crud.asteroid.upsert(db, asteroid_data=data)
            for approach in data["close_approaches"]:
                crud.close_approach.upsert(db, asteroid_id=asteroid.id, approach_data=approach)
            count += 1
        
        return {"message": f"Successfully synced {count} asteroids", "start_date": start_date.isoformat(), "end_date": end_date.isoformat()}
    except Exception as e:
        logger.error(f"NASA sync error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to sync NASA data: {str(e)}")
