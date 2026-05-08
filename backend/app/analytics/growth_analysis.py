"""
Growth Analysis System

Classifies trends as:
  - Exploding: growth > 50%
  - Rising: growth 10-50%
  - Stable: growth -10% to 10%
  - Declining: growth -50% to -10%
  - Crashing: growth < -50%
"""

from typing import Literal

from sqlalchemy.orm import Session

from app.models.analytics import Analytics
from app.models.trend import Trend

Classification = Literal["exploding", "rising", "stable", "declining", "crashing"]


class GrowthAnalysis:
    def __init__(self, db: Session):
        self.db = db

    def classify_growth(self, growth_rate: float) -> Classification:
        if growth_rate > 50:
            return "exploding"
        elif growth_rate > 10:
            return "rising"
        elif growth_rate > -10:
            return "stable"
        elif growth_rate > -50:
            return "declining"
        else:
            return "crashing"

    def analyze_trend(self, trend: Trend) -> dict:
        classification = self.classify_growth(trend.growth)
        return {
            "id": trend.id,
            "title": trend.title,
            "category": trend.category,
            "growth": trend.growth,
            "classification": classification,
            "score": trend.score,
        }

    def get_by_classification(self, classification: Classification, limit: int = 20) -> list[dict]:
        all_trends = self.db.query(Trend).all()
        results = []
        for t in all_trends:
            if self.classify_growth(t.growth) == classification:
                results.append(self.analyze_trend(t))
        results.sort(key=lambda x: abs(x["growth"]), reverse=True)
        return results[:limit]

    def get_exploding(self, limit: int = 10) -> list[dict]:
        return self.get_by_classification("exploding", limit)

    def get_rising(self, limit: int = 10) -> list[dict]:
        return self.get_by_classification("rising", limit)

    def get_declining(self, limit: int = 10) -> list[dict]:
        return self.get_by_classification("declining", limit)

    def get_growth_summary(self) -> dict:
        all_trends = self.db.query(Trend).all()
        counts = {"exploding": 0, "rising": 0, "stable": 0, "declining": 0, "crashing": 0}
        for t in all_trends:
            cls = self.classify_growth(t.growth)
            counts[cls] += 1
        return counts
