import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.jobs.collectors_job import collect_all
from app.jobs.analytics_job import recalculate_analytics
from app.jobs.snapshots_job import save_historical_snapshots
from app.jobs.cleanup_job import run_cleanup
from app.services.logger import get_logger

logger = get_logger("run_jobs")


def main():
    logger.info("=== Running all jobs once ===")

    logger.info("[1/4] Collecting data from all sources...")
    collect_all()

    logger.info("[2/4] Recalculating analytics...")
    recalculate_analytics()

    logger.info("[3/4] Saving historical snapshots...")
    save_historical_snapshots()

    logger.info("[4/4] Running cleanup...")
    run_cleanup()

    logger.info("=== All jobs completed ===")


if __name__ == "__main__":
    main()
