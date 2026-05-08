import time

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.session import get_session
from app.jobs.scheduler import scheduler
from app.services.cache import cache
from app.services.logger import get_logger

logger = get_logger("system")
router = APIRouter(prefix="/system", tags=["System"])


@router.get("/status")
def system_status(db: Session = Depends(get_session)):
    scheduler_status = scheduler.get_status()

    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        pass

    return {
        "status": "ok" if db_ok else "degraded",
        "scheduler": scheduler_status,
        "cache": {
            "size": cache.size,
            "ttl_seconds": 300,
        },
        "database": "connected" if db_ok else "error",
        "timestamp": time.time(),
    }


@router.get("/health")
def health():
    scheduler_status = scheduler.get_status()
    return {
        "status": "ok" if scheduler_status["running"] else "degraded",
        "scheduler_running": scheduler_status["running"],
    }
