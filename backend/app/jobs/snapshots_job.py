from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.trend import Trend
from app.services.logger import get_logger
from app.services.snapshot_service import SnapshotService

logger = get_logger("snapshots_job")


def save_historical_snapshots():
    db: Session = SessionLocal()
    try:
        trends = db.query(Trend).all()
        if not trends:
            logger.info("No trends to snapshot")
            return 0

        snapshot_service = SnapshotService(db)
        trend_dicts = [
            {"id": t.id, "score": t.score, "growth": t.growth}
            for t in trends
        ]
        snapshots = snapshot_service.create_bulk_snapshots(trend_dicts)
        logger.info("Saved %d historical snapshots", len(snapshots))
        return len(snapshots)
    except Exception as e:
        db.rollback()
        logger.error("Snapshot job failed: %s", str(e))
        return 0
    finally:
        db.close()
