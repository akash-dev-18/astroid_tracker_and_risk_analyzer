from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import os

from app.config import settings
from app.database import engine, Base
from app.api.v1 import auth, asteroids, watchlist, alerts
from app.utils.scheduler import asteroid_scheduler

logging.basicConfig(level=logging.DEBUG if settings.DEBUG else logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting Cosmic Watch API...")
    
    data_dir = os.path.dirname(settings.DATABASE_URL.replace("sqlite:///", ""))
    if data_dir and not os.path.exists(data_dir):
        os.makedirs(data_dir, exist_ok=True)
    
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables ready")
    
    if settings.ENABLE_SCHEDULER:
        asteroid_scheduler.start()
        logger.info("✅ Scheduler started")
    
    logger.info(f"✅ {settings.APP_NAME} v{settings.VERSION} ready!")
    yield
    
    logger.info("🛑 Shutting down...")
    if settings.ENABLE_SCHEDULER:
        asteroid_scheduler.shutdown()
    logger.info("👋 Goodbye!")


app = FastAPI(
    title=settings.APP_NAME,
    description="REST API for monitoring Near-Earth Objects with NASA NeoWs integration",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(CORSMiddleware, allow_origins=settings.ALLOWED_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router, prefix="/api/v1")
app.include_router(asteroids.router, prefix="/api/v1")
app.include_router(watchlist.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")


@app.get("/", tags=["Root"])
async def root():
    return {"name": settings.APP_NAME, "version": settings.VERSION, "message": "Welcome to Cosmic Watch API! 🚀", "docs": "/docs"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "version": settings.VERSION}
