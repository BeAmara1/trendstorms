import os
from datetime import datetime, timedelta, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.analytics import Analytics
from app.services.logger import get_logger

logger = get_logger("cleanup_job")
LOG_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "logs")
MAX_LOG_AGE_DAYS = 30
MAX_SNAPSHOT_AGE_DAYS = 90


def cleanup_old_logs():
    if not os.path.isdir(LOG_DIR):
        logger.info("Log directory not found, skipping")
        return 0

    cutoff = datetime.now().timestamp() - MAX_LOG_AGE_DAYS * 86400
    removed = 0
    for fname in os.listdir(LOG_DIR):
        fpath = os.path.join(LOG_DIR, fname)
        if os.path.isfile(fpath) and fname.endswith(".log"):
            try:
                mtime = os.path.getmtime(fpath)
                if mtime < cutoff:
                    os.remove(fpath)
                    removed += 1
            except Exception as e:
                logger.warning("Could not remove %s: %s", fname, e)

    logger.info("Cleaned %d old log files", removed)
    return removed


def deduplicate_analytics(db: Session | None = None):
    own_session = False
    if db is None:
        db = SessionLocal()
        own_session = True
    try:
        keep_ids = [
            r[0]
            for r in db.query(func.min(Analytics.id))
            .group_by(Analytics.trend_id, Analytics.hype_score, Analytics.growth_rate)
            .all()
        ]

        if not keep_ids:
            logger.info("No analytics entries to deduplicate")
            return 0

        deleted = (
            db.query(Analytics)
            .filter(Analytics.id.notin_(keep_ids))
            .delete(synchronize_session="fetch")
        )
        db.commit()
        logger.info("Deduplicated %d analytics entries", deleted)
        return deleted
    except Exception as e:
        if own_session:
            db.rollback()
        logger.error("Dedup failed: %s", str(e))
        return 0
    finally:
        if own_session:
            db.close()


def purge_old_snapshots(db: Session | None = None):
    own_session = False
    if db is None:
        db = SessionLocal()
        own_session = True
    try:
        cutoff = datetime.now(timezone.utc) - timedelta(days=MAX_SNAPSHOT_AGE_DAYS)
        deleted = (
            db.query(Analytics)
            .filter(Analytics.created_at < cutoff)
            .delete(synchronize_session="fetch")
        )
        db.commit()
        logger.info("Purged %d snapshots older than %d days", deleted, MAX_SNAPSHOT_AGE_DAYS)
        return deleted
    except Exception as e:
        if own_session:
            db.rollback()
        logger.error("Purge failed: %s", str(e))
        return 0
    finally:
        if own_session:
            db.close()


def run_cleanup(db: Session | None = None):
    results = {
        "logs_cleaned": cleanup_old_logs(),
        "snapshots_purged": purge_old_snapshots(db),
        "duplicates_removed": deduplicate_analytics(db),
    }
    logger.info("Cleanup complete: %s", results)
    return results
