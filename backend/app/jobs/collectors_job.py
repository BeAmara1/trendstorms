from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.pipeline.ingestion import (
    run_rawg_pipeline,
    run_spotify_pipeline,
    run_steam_pipeline,
    run_tmdb_pipeline,
    run_trends_pipeline,
)
from app.services.logger import get_logger
from app.services.retry import RateLimiter

logger = get_logger("collectors_job")

_steam_limiter = RateLimiter(min_interval=30.0)
_spotify_limiter = RateLimiter(min_interval=60.0)
_tmdb_limiter = RateLimiter(min_interval=120.0)
_trends_limiter = RateLimiter(min_interval=240.0)


def _run_pipeline(name: str, fn, limiter: RateLimiter | None = None) -> int:
    db: Session = SessionLocal()
    try:
        if limiter:
            limiter.wait()
        data = fn(db)
        db.commit()
        count = len(data)
        logger.info("%s pipeline: %d items collected", name, count)
        return count
    except Exception as e:
        db.rollback()
        logger.error("%s pipeline failed: %s", name, str(e))
        return 0
    finally:
        db.close()


def collect_steam():
    return _run_pipeline("steam", run_steam_pipeline, _steam_limiter)


def collect_spotify():
    return _run_pipeline("spotify", run_spotify_pipeline, _spotify_limiter)


def collect_tmdb():
    return _run_pipeline("tmdb", run_tmdb_pipeline, _tmdb_limiter)


def collect_rawg():
    return _run_pipeline("rawg", run_rawg_pipeline, _steam_limiter)


def collect_trends():
    return _run_pipeline("trends", run_trends_pipeline, _trends_limiter)


def collect_all():
    results = {}
    results["steam"] = collect_steam()
    results["spotify"] = collect_spotify()
    results["rawg"] = collect_rawg()
    results["tmdb"] = collect_tmdb()
    results["trends"] = collect_trends()
    logger.info("All collectors finished: %s", results)
    return results
