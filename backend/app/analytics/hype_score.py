"""
Hype Score Engine

Formula: H = 0.4G + 0.3S + 0.2M + 0.1P
  G = Google Trends score
  S = Steam/Spotify growth
  M = Movie/Game popularity
  P = General popularity
"""

from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.models.analytics import Analytics
from app.models.trend import Trend
from app.services.logger import get_logger

logger = get_logger("hype_score")


class HypeScoreEngine:
    def __init__(self, db: Session):
        self.db = db

    def calculate(self, trend: Trend) -> float:
        score = trend.score
        growth = max(0, trend.growth)

        source_weight = self._get_source_weight(trend.source)
        category_weight = self._get_category_weight(trend.category)

        hype = (
            0.4 * min(score, 100) +
            0.3 * min(growth, 100) +
            0.2 * source_weight * 100 +
            0.1 * category_weight * 100
        )
        return round(min(hype, 100), 2)

    def calculate_from_data(self, data: dict[str, Any]) -> float:
        score = data.get("score", 0)
        growth = max(0, data.get("growth", 0))
        source_weight = self._get_source_weight(data.get("source", ""))
        category_weight = self._get_category_weight(data.get("category", ""))

        hype = (
            0.4 * min(score, 100) +
            0.3 * min(growth, 100) +
            0.2 * source_weight * 100 +
            0.1 * category_weight * 100
        )
        return round(min(hype, 100), 2)

    def _get_source_weight(self, source: str) -> float:
        weights = {
            "spotify": 0.9,
            "steam": 0.85,
            "rawg": 0.8,
            "tmdb": 0.85,
            "google_trends": 1.0,
        }
        return weights.get(source, 0.5)

    def _get_category_weight(self, category: str) -> float:
        weights = {
            "music": 0.9,
            "game": 0.85,
            "movie": 0.8,
            "tv": 0.85,
            "artist": 0.75,
            "trending_search": 1.0,
        }
        return weights.get(category, 0.5)

    def compute_for_all_trends(self) -> list[dict[str, Any]]:
        trends = self.db.query(Trend).all()
        results = []
        for t in trends:
            hype = self.calculate(t)
            results.append({
                "id": t.id,
                "title": t.title,
                "category": t.category,
                "source": t.source,
                "score": t.score,
                "growth": t.growth,
                "hype_score": hype,
            })
        results.sort(key=lambda x: x["hype_score"], reverse=True)
        return results

    def save_daily_snapshot(self) -> list[Analytics]:
        trends = self.db.query(Trend).all()
        snapshots = []
        for t in trends:
            hype = self.calculate(t)
            analytics = Analytics(
                trend_id=t.id,
                hype_score=hype,
                growth_rate=t.growth,
                sentiment_score=0.0,
            )
            self.db.add(analytics)
            snapshots.append(analytics)
        self.db.commit()
        for s in snapshots:
            self.db.refresh(s)
        logger.info("Saved %d hype score snapshots", len(snapshots))
        return snapshots
