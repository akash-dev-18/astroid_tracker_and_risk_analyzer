from datetime import datetime, date
from typing import Optional


def format_distance(km: float) -> str:
    if km >= 1_000_000:
        return f"{km / 1_000_000:.2f} million km"
    elif km >= 1_000:
        return f"{km:,.0f} km"
    return f"{km:.2f} km"


def lunar_to_km(lunar_distances: float) -> float:
    return lunar_distances * 384_400


def km_to_lunar(km: float) -> float:
    return km / 384_400


def parse_nasa_date(date_str: str) -> Optional[date]:
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return None
