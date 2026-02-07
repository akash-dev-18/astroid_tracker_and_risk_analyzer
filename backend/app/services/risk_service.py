from app.models.asteroid import Asteroid
from app.models.close_approach import CloseApproach


def calculate_risk_score(asteroid: Asteroid, approach: CloseApproach) -> str:
    score = 0
    
    if asteroid.is_hazardous:
        score += 50
    
    diameter = asteroid.estimated_diameter_max or 0
    if diameter > 1.0:
        score += 30
    elif diameter > 0.5:
        score += 20
    elif diameter > 0.1:
        score += 10
    elif diameter > 0.05:
        score += 5
    
    lunar_distance = approach.miss_distance_lunar or float('inf')
    if lunar_distance < 1:
        score += 20
    elif lunar_distance < 5:
        score += 15
    elif lunar_distance < 10:
        score += 10
    elif lunar_distance < 20:
        score += 5
    
    if score >= 70:
        return "EXTREME"
    elif score >= 50:
        return "HIGH"
    elif score >= 30:
        return "MODERATE"
    return "LOW"


def get_risk_color(risk_score: str) -> str:
    colors = {"EXTREME": "#ff0000", "HIGH": "#ff6600", "MODERATE": "#ffcc00", "LOW": "#00cc00"}
    return colors.get(risk_score, "#808080")
