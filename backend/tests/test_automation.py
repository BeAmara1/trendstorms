import os
import time
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest

from app.jobs.cleanup_job import cleanup_old_logs, deduplicate_analytics, purge_old_snapshots, run_cleanup
from app.jobs.scheduler import SchedulerManager
from app.models.analytics import Analytics
from app.models.trend import Trend
from app.services.cache import MemoryCache
from app.services.retry import RateLimiter, with_retry


class TestRetrySystem:
    def test_successful_call(self):
        call_count = 0

        @with_retry(max_retries=3, delay=0.01)
        def work():
            nonlocal call_count
            call_count += 1
            return "ok"

        assert work() == "ok"
        assert call_count == 1

    def test_retry_on_failure_then_succeed(self):
        call_count = 0

        @with_retry(max_retries=3, delay=0.01)
        def work():
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise ValueError("temporary")
            return "ok"

        assert work() == "ok"
        assert call_count == 3

    def test_exhaust_retries_raises(self):
        call_count = 0

        @with_retry(max_retries=2, delay=0.01)
        def work():
            nonlocal call_count
            call_count += 1
            raise ValueError("always fails")

        with pytest.raises(ValueError):
            work()
        assert call_count == 2


class TestRateLimiter:
    def test_does_not_block_first_call(self):
        limiter = RateLimiter(min_interval=0.0)
        start = time.monotonic()
        limiter.wait()
        elapsed = time.monotonic() - start
        assert elapsed < 0.1

    def test_blocks_second_call(self):
        limiter = RateLimiter(min_interval=0.1)
        limiter.wait()
        start = time.monotonic()
        limiter.wait()
        elapsed = time.monotonic() - start
        assert elapsed >= 0.08


class TestMemoryCache:
    def test_get_set(self):
        c = MemoryCache(ttl=60)
        c.set("key", "value")
        assert c.get("key") == "value"

    def test_expiry(self):
        c = MemoryCache(ttl=0)
        c.set("key", "value")
        time.sleep(0.01)
        assert c.get("key") is None

    def test_invalidate(self):
        c = MemoryCache(ttl=60)
        c.set("key", "value")
        c.invalidate("key")
        assert c.get("key") is None

    def test_eviction(self):
        c = MemoryCache(ttl=60, maxsize=2)
        c.set("a", 1)
        c.set("b", 2)
        c.set("c", 3)
        assert c.get("a") is None
        assert c.get("b") is not None
        assert c.get("c") is not None

    def test_clear(self):
        c = MemoryCache(ttl=60)
        c.set("a", 1)
        c.set("b", 2)
        c.clear()
        assert c.size == 0

    def test_custom_ttl(self):
        c = MemoryCache(ttl=60)
        c.set("key", "value", ttl=0)
        time.sleep(0.01)
        assert c.get("key") is None


class TestCleanupJob:
    def test_deduplicate_analytics(self, db_session):
        trend = Trend(title="Test", category="music", source="spotify", score=50, growth=20)
        db_session.add(trend)
        db_session.commit()
        db_session.flush()

        now = datetime.now(timezone.utc)
        for _ in range(3):
            db_session.add(Analytics(
                trend_id=trend.id, hype_score=50.0, growth_rate=20.0, created_at=now,
            ))
        db_session.commit()
        db_session.flush()

        removed = deduplicate_analytics(db_session)
        assert removed >= 2

    def test_purge_old_snapshots(self, db_session):
        trend = Trend(title="Test", category="music", source="spotify", score=50, growth=20)
        db_session.add(trend)
        db_session.commit()
        db_session.flush()

        old = datetime.now(timezone.utc) - timedelta(days=200)
        recent = datetime.now(timezone.utc)
        db_session.add(Analytics(trend_id=trend.id, hype_score=10.0, growth_rate=5.0, created_at=old))
        db_session.add(Analytics(trend_id=trend.id, hype_score=20.0, growth_rate=10.0, created_at=recent))
        db_session.commit()
        db_session.flush()

        purged = purge_old_snapshots(db_session)
        assert purged == 1

        remaining = db_session.query(Analytics).all()
        assert len(remaining) == 1

    def test_cleanup_old_logs(self, tmp_path):
        import app.jobs.cleanup_job as mod
        original = mod.LOG_DIR
        mod.LOG_DIR = str(tmp_path)

        old_file = tmp_path / "old.log"
        with open(old_file, "w") as f:
            f.write("old data")
        old_mtime = time.time() - 31 * 86400
        os.utime(old_file, (old_mtime, old_mtime))

        new_file = tmp_path / "new.log"
        with open(new_file, "w") as f:
            f.write("new data")

        count = cleanup_old_logs()
        assert count == 1
        assert not old_file.exists()
        assert new_file.exists()

        mod.LOG_DIR = original

    def test_run_cleanup(self, db_session):
        trend = Trend(title="CleanupTest", category="music", source="spotify", score=50, growth=20)
        db_session.add(trend)
        db_session.commit()
        db_session.flush()

        now = datetime.now(timezone.utc)
        for _ in range(3):
            db_session.add(Analytics(
                trend_id=trend.id, hype_score=50.0, growth_rate=20.0, created_at=now,
            ))
        db_session.commit()
        db_session.flush()

        results = run_cleanup(db_session)
        assert isinstance(results, dict)
        assert "logs_cleaned" in results
        assert "snapshots_purged" in results
        assert "duplicates_removed" in results


class TestSchedulerManager:
    def test_initial_state(self):
        mgr = SchedulerManager()
        status = mgr.get_status()
        assert status["running"] is False
        assert status["job_count"] == 0
        assert status["started_at"] is None

    def test_start_and_stop(self):
        mgr = SchedulerManager()
        mgr.start()
        assert mgr.running is True
        assert mgr.started_at is not None
        status = mgr.get_status()
        assert status["running"] is True
        assert status["job_count"] == 8
        mgr.stop()
        assert mgr.running is False

    def test_double_start(self):
        mgr = SchedulerManager()
        mgr.start()
        assert mgr.running is True
        mgr.start()  # should log warning, not crash
        mgr.stop()

    def test_get_status_jobs(self):
        mgr = SchedulerManager()
        mgr.start()
        status = mgr.get_status()
        job_ids = {j["id"] for j in status["jobs"]}
        assert "collect_steam" in job_ids
        assert "collect_spotify" in job_ids
        assert "collect_tmdb" in job_ids
        assert "collect_rawg" in job_ids
        assert "collect_trends" in job_ids
        assert "analytics" in job_ids
        assert "snapshots" in job_ids
        assert "cleanup" in job_ids
        mgr.stop()


class TestSystemRoutes:
    def test_system_status(self, client):
        resp = client.get("/system/status")
        assert resp.status_code == 200
        body = resp.json()
        assert "status" in body
        assert "scheduler" in body
        assert "database" in body
        assert "cache" in body

    def test_system_health(self, client):
        resp = client.get("/system/health")
        assert resp.status_code == 200
        body = resp.json()
        assert "status" in body
        assert "scheduler_running" in body
