from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
import time

from app.config import settings
from app.jobs.scheduler import scheduler
from app.middleware.rate_limit import RateLimitMiddleware
from app.routes import trends, games, music, movies, analytics, system
from app.services.logger import get_logger

logger = get_logger("api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.is_production:
        logger.info("Starting scheduler in production mode...")
    else:
        logger.info("Starting scheduler...")
    scheduler.start()
    yield
    logger.info("Shutting down scheduler...")
    scheduler.stop()


app = FastAPI(
    title="Trendpulse API",
    description="Cultural trends analytics dashboard API using Spotify, Steam, TMDB and Google Trends data.",
    version="0.3.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(RateLimitMiddleware, max_requests=100, window_seconds=60)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    logger.info(
        "%s %s -> %d (%.2fms)",
        request.method,
        request.url.path,
        response.status_code,
        duration * 1000,
    )
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled error on %s %s: %s", request.method, request.url.path, str(exc))
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error("Database error on %s %s: %s", request.method, request.url.path, str(exc))
    return JSONResponse(
        status_code=500,
        content={"detail": "Database error"},
    )


app.include_router(trends.router)
app.include_router(games.router)
app.include_router(music.router)
app.include_router(movies.router)
app.include_router(analytics.router)
app.include_router(system.router)


@app.get("/")
def root():
    return {
        "message": "Trendpulse API running",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
