from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app import crud
import logging

logger = logging.getLogger(__name__)


class AlertService:
    def generate_alerts_for_approaches(self, db: Session) -> int:
        all_watchlist = crud.watchlist.get_all(db)
        alerts_created = 0
        
        for entry in all_watchlist:
            asteroid = entry.asteroid
            if not asteroid or not asteroid.close_approaches:
                continue
            
            today = datetime.now().date()
            future_date = (datetime.now() + timedelta(days=30)).date()
            
            upcoming = [a for a in asteroid.close_approaches if today <= a.approach_date <= future_date]
            
            for approach in upcoming:
                if approach.miss_distance_km and approach.miss_distance_km <= entry.alert_distance_km:
                    existing = crud.alert.get_by_user_asteroid_date(
                        db, user_id=entry.user_id, asteroid_id=asteroid.id, approach_date=approach.approach_date_full
                    )
                    
                    if not existing:
                        lunar_dist = approach.miss_distance_lunar or 0
                        message = f"🚨 Close Approach: {asteroid.name} will pass within {lunar_dist:.2f} lunar distances on {approach.approach_date.strftime('%B %d, %Y')}"
                        if asteroid.is_hazardous:
                            message = f"⚠️ HAZARDOUS - {message}"
                        
                        crud.alert.create(db, user_id=entry.user_id, asteroid_id=asteroid.id, message=message,
                                         alert_type="close_approach", approach_date=approach.approach_date_full)
                        alerts_created += 1
        
        logger.info(f"Generated {alerts_created} new alerts")
        return alerts_created


alert_service = AlertService()
