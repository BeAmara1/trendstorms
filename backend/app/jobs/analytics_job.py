from sqlalchemy.orm import Session

from app.analytics import HypeScoreEngine
from app.database.session import SessionLocal
from app.services.logger import get_logger

logger = get_logger("analytics_job")


def recalculate_analytics():
    db: Session = SessionLocal()
    try:
        engine = HypeScoreEngine(db)
        snapshots = engine.save_daily_snapshot()
        logger.info("Analytics recalculated: %d hype score snapshots saved", len(snapshots))
        return len(snapshots)
    except Exception as e:
        db.rollback()
        logger.error("Analytics recalculation failed: %s", str(e))
        return 0
    finally:
        db.close()
