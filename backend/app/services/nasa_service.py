import httpx
from typing import Dict, List, Optional
from datetime import date, timedelta
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class NASAService:
    BASE_URL = "https://api.nasa.gov/neo/rest/v1"
    
    def __init__(self):
        self.api_key = settings.NASA_API_KEY
    
    async def fetch_feed(self, start_date: date, end_date: date) -> Dict:
        if (end_date - start_date).days > 7:
            end_date = start_date + timedelta(days=7)
        
        url = f"{self.BASE_URL}/feed"
        params = {"start_date": start_date.isoformat(), "end_date": end_date.isoformat(), "api_key": self.api_key}
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"NASA API feed error: {e}")
            raise
    
    async def lookup_asteroid(self, asteroid_id: str) -> Optional[Dict]:
        url = f"{self.BASE_URL}/neo/{asteroid_id}"
        params = {"api_key": self.api_key}
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    def parse_feed_response(self, response: Dict) -> List[Dict]:
        asteroids = []
        for date_str, neos in response.get("near_earth_objects", {}).items():
            for neo in neos:
                asteroid_data = {
                    "id": neo["id"],
                    "name": neo["name"],
                    "absolute_magnitude": neo.get("absolute_magnitude_h"),
                    "is_hazardous": neo.get("is_potentially_hazardous_asteroid", False),
                    "estimated_diameter_min": neo.get("estimated_diameter", {}).get("kilometers", {}).get("estimated_diameter_min"),
                    "estimated_diameter_max": neo.get("estimated_diameter", {}).get("kilometers", {}).get("estimated_diameter_max"),
                    "nasa_jpl_url": neo.get("nasa_jpl_url"),
                    "close_approaches": []
                }
                
                for approach in neo.get("close_approach_data", []):
                    asteroid_data["close_approaches"].append({
                        "approach_date": approach["close_approach_date"],
                        "approach_date_full": approach.get("close_approach_date_full"),
                        "velocity_kmh": float(approach["relative_velocity"]["kilometers_per_hour"]),
                        "miss_distance_km": float(approach["miss_distance"]["kilometers"]),
                        "miss_distance_lunar": float(approach["miss_distance"]["lunar"]),
                        "orbiting_body": approach["orbiting_body"]
                    })
                asteroids.append(asteroid_data)
        return asteroids


nasa_service = NASAService()
