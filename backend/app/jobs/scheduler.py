import atexit
from datetime import datetime, timezone
from typing import Any

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.jobs.analytics_job import recalculate_analytics
from app.jobs.cleanup_job import run_cleanup
from app.jobs.collectors_job import collect_all, collect_rawg, collect_spotify, collect_steam, collect_tmdb, collect_trends
from app.jobs.snapshots_job import save_historical_snapshots
from app.services.logger import get_logger

logger = get_logger("scheduler")


class SchedulerManager:
    def __init__(self):
        self._scheduler: BackgroundScheduler | None = None
        self._job_registry: dict[str, dict[str, Any]] = {}
        self._started_at: datetime | None = None

    @property
    def running(self) -> bool:
        return self._scheduler is not None and self._scheduler.running

    @property
    def started_at(self) -> str | None:
        return self._started_at.isoformat() if self._started_at else None

    def get_status(self) -> dict:
        jobs = []
        if self._scheduler:
            for job in self._scheduler.get_jobs():
                jobs.append({
                    "id": job.id,
                    "name": job.name,
                    "next_run": str(job.next_run_time) if job.next_run_time else None,
                    "trigger": str(job.trigger),
                })
        return {
            "running": self.running,
            "started_at": self.started_at,
            "job_count": len(jobs),
            "jobs": jobs,
        }

    def start(self):
        if self.running:
            logger.warning("Scheduler already running")
            return

        self._scheduler = BackgroundScheduler(daemon=True)
        self._started_at = datetime.now(timezone.utc)

        self._register_jobs()
        self._scheduler.start()
        atexit.register(self.stop)

        logger.info("Scheduler started with %d jobs", len(self._job_registry))

    def stop(self):
        if self._scheduler and self._scheduler.running:
            self._scheduler.shutdown(wait=False)
            logger.info("Scheduler stopped")

    def _add_job(self, job_id: str, name: str, fn, trigger, **kwargs):
        if not self._scheduler:
            return
        job = self._scheduler.add_job(fn, trigger, id=job_id, name=name, **kwargs)
        self._job_registry[job_id] = {
            "name": name,
            "interval": str(trigger),
        }
        logger.info("Registered job: %s (%s)", job_id, trigger)

    def _register_jobs(self):
        self._add_job(
            "collect_steam", "Steam Collector", collect_steam,
            IntervalTrigger(minutes=30), replace_existing=True,
        )
        self._add_job(
            "collect_spotify", "Spotify Collector", collect_spotify,
            IntervalTrigger(hours=1), replace_existing=True,
        )
        self._add_job(
            "collect_tmdb", "TMDB Collector", collect_tmdb,
            IntervalTrigger(hours=2), replace_existing=True,
        )
        self._add_job(
            "collect_rawg", "RAWG Collector", collect_rawg,
            IntervalTrigger(minutes=30), replace_existing=True,
        )
        self._add_job(
            "collect_trends", "Trends Collector", collect_trends,
            IntervalTrigger(hours=4), replace_existing=True,
        )
        self._add_job(
            "analytics", "Analytics Recalculation", recalculate_analytics,
            IntervalTrigger(hours=1), replace_existing=True,
        )
        self._add_job(
            "snapshots", "Historical Snapshots", save_historical_snapshots,
            IntervalTrigger(hours=6), replace_existing=True,
        )
        self._add_job(
            "cleanup", "Cleanup Job", run_cleanup,
            IntervalTrigger(days=1), replace_existing=True,
        )


scheduler = SchedulerManager()
