from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.models.analytics import Analytics
from app.models.trend import Trend


class SnapshotService:
    def __init__(self, db: Session):
        self.db = db

    def create_snapshot(self, trend: Trend) -> Analytics:
        analytics = Analytics(
            trend_id=trend.id,
            hype_score=trend.score,
            growth_rate=trend.growth,
            sentiment_score=0.0,
        )
        self.db.add(analytics)
        self.db.commit()
        self.db.refresh(analytics)
        return analytics

    def get_trend_history(self, trend_id: int, limit: int = 50) -> list[Analytics]:
        return (
            self.db.query(Analytics)
            .filter(Analytics.trend_id == trend_id)
            .order_by(Analytics.created_at.desc())
            .limit(limit)
            .all()
        )

    def create_bulk_snapshots(self, trends: list[dict[str, Any]]) -> list[Analytics]:
        snapshots = []
        for t in trends:
            analytics = Analytics(
                trend_id=t["id"],
                hype_score=t.get("score", 0),
                growth_rate=t.get("growth", 0),
            )
            self.db.add(analytics)
            snapshots.append(analytics)
        self.db.commit()
        for s in snapshots:
            self.db.refresh(s)
        return snapshots

    def get_top_growing(self, limit: int = 20) -> list[Analytics]:
        return (
            self.db.query(Analytics)
            .order_by(Analytics.growth_rate.desc())
            .limit(limit)
            .all()
        )
