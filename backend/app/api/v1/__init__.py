from app.api.v1.auth import router as auth_router
from app.api.v1.asteroids import router as asteroids_router
from app.api.v1.watchlist import router as watchlist_router
from app.api.v1.alerts import router as alerts_router

__all__ = ["auth_router", "asteroids_router", "watchlist_router", "alerts_router"]
