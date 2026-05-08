from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.models.trend import Trend


class TrendsRepository:
    def __init__(self, db: Session):
        self.db = db

    def save_trend(self, data: dict[str, Any]) -> Trend:
        trend = Trend(
            title=data["title"],
            category=data["category"],
            source=data["source"],
            score=data.get("score", 0),
            growth=data.get("growth", 0),
            extra_data=str(data.get("extra", {})),
        )
        self.db.add(trend)
        self.db.commit()
        self.db.refresh(trend)
        return trend

    def get_latest_trends(self, limit: int = 50) -> list[Trend]:
        return (
            self.db.query(Trend)
            .order_by(Trend.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_trends_by_category(self, category: str, limit: int = 50) -> list[Trend]:
        return (
            self.db.query(Trend)
            .filter(Trend.category == category)
            .order_by(Trend.score.desc())
            .limit(limit)
            .all()
        )

    def get_trends_by_source(self, source: str, limit: int = 50) -> list[Trend]:
        return (
            self.db.query(Trend)
            .filter(Trend.source == source)
            .order_by(Trend.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_trend_by_title_category(self, title: str, category: str) -> Trend | None:
        return (
            self.db.query(Trend)
            .filter(Trend.title == title, Trend.category == category)
            .order_by(Trend.created_at.desc())
            .first()
        )

    def trend_exists(self, title: str, category: str, source: str, hours: int = 1) -> bool:
        cutoff = datetime.now(timezone.utc)
        return (
            self.db.query(Trend)
            .filter(
                Trend.title == title,
                Trend.category == category,
                Trend.source == source,
                Trend.created_at >= cutoff,
            )
            .first()
            is not None
        )
