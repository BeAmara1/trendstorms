from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.models.trend import Trend
from app.repositories.trends_repository import TrendsRepository


class TrendService:
    def __init__(self, db: Session):
        self.repo = TrendsRepository(db)

    def get_all(self, category: str | None = None, source: str | None = None, sort: str = "score", page: int = 1, limit: int = 20) -> tuple[list[Trend], int]:
        query = self.repo.db.query(Trend)

        if category:
            query = query.filter(Trend.category == category)
        if source:
            query = query.filter(Trend.source == source)

        total = query.count()

        sort_map = {
            "score": Trend.score.desc(),
            "growth": Trend.growth.desc(),
            "newest": Trend.created_at.desc(),
            "oldest": Trend.created_at.asc(),
        }
        order = sort_map.get(sort, Trend.score.desc())
        query = query.order_by(order)

        offset = (page - 1) * limit
        items = query.offset(offset).limit(limit).all()

        return items, total

    def get_by_id(self, trend_id: int) -> Trend | None:
        return self.repo.db.query(Trend).filter(Trend.id == trend_id).first()

    def get_top(self, category: str | None = None, limit: int = 20) -> list[Trend]:
        query = self.repo.db.query(Trend)
        if category:
            query = query.filter(Trend.category == category)
        return query.order_by(Trend.score.desc()).limit(limit).all()

    def get_categories(self) -> list[str]:
        results = self.repo.db.query(Trend.category).distinct().all()
        return [r[0] for r in results]
