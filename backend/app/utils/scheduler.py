from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import date, timedelta
from app.database import SessionLocal
from app.services.nasa_service import nasa_service
from app.services.alert_service import alert_service
from app import crud
import logging
import asyncio

logger = logging.getLogger(__name__)


class AsteroidScheduler:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
    
    def start(self):
        self.scheduler.add_job(func=self._run_fetch_nasa_data, trigger=IntervalTrigger(hours=6), id="fetch_nasa_data", replace_existing=True)
        self.scheduler.add_job(func=self.generate_alerts, trigger=IntervalTrigger(hours=1), id="generate_alerts", replace_existing=True)
        self.scheduler.add_job(func=self._run_fetch_nasa_data, trigger=IntervalTrigger(seconds=30), id="initial_sync", replace_existing=True, max_instances=1)
        self.scheduler.start()
        logger.info("Background scheduler started")
    
    def shutdown(self):
        self.scheduler.shutdown()
        logger.info("Background scheduler stopped")
    
    def _run_fetch_nasa_data(self):
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(self.fetch_nasa_data())
            loop.close()
        except Exception as e:
            logger.error(f"NASA fetch error: {e}")
    
    async def fetch_nasa_data(self):
        db = SessionLocal()
        try:
            logger.info("Starting NASA data fetch...")
            start_date, end_date = date.today(), date.today() + timedelta(days=7)
            response = await nasa_service.fetch_feed(start_date, end_date)
            asteroids_data = nasa_service.parse_feed_response(response)
            
            count = 0
            for data in asteroids_data:
                asteroid = crud.asteroid.upsert(db, asteroid_data=data)
                for approach in data["close_approaches"]:
                    crud.close_approach.upsert(db, asteroid_id=asteroid.id, approach_data=approach)
                count += 1
            db.commit()
            logger.info(f"Synced {count} asteroids from NASA")
            
            if self.scheduler.get_job("initial_sync"):
                self.scheduler.remove_job("initial_sync")
        except Exception as e:
            logger.error(f"Error fetching NASA data: {e}")
            db.rollback()
        finally:
            db.close()
    
    def generate_alerts(self):
        db = SessionLocal()
        try:
            logger.info("Generating alerts...")
            count = alert_service.generate_alerts_for_approaches(db)
            db.commit()
            logger.info(f"Generated {count} alerts")
        except Exception as e:
            logger.error(f"Alert generation error: {e}")
            db.rollback()
        finally:
            db.close()


asteroid_scheduler = AsteroidScheduler()
