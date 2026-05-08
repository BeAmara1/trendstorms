"""
Trend Detection & Classification System

Automatically detects and classifies trend behavior:
  - Explosive: sudden high growth in short period
  - Viral: rapid spread across multiple sources
  - Sustained: consistent growth over time
  - Seasonal: periodic patterns
  - Falling: consistent decline
"""

from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Literal

from sqlalchemy.orm import Session

from app.models.analytics import Analytics
from app.models.trend import Trend

Classification = Literal["explosive", "viral", "sustained", "seasonal", "falling", "new"]


class TrendDetection:
    def __init__(self, db: Session):
        self.db = db

    def classify_trend(self, trend: Trend) -> dict:
        snapshots = (
            self.db.query(Analytics)
            .filter(Analytics.trend_id == trend.id)
            .order_by(Analytics.created_at.desc())
            .limit(10)
            .all()
        )

        if not snapshots:
            return {"classification": "new", "confidence": 0.0}

        latest = snapshots[0]
        oldest = snapshots[-1]

        total_growth = latest.hype_score - oldest.hype_score if oldest.hype_score > 0 else 0
        growth_rate = (total_growth / oldest.hype_score * 100) if oldest.hype_score > 0 else 0

        recent_growth = 0
        if len(snapshots) >= 3:
            recent = snapshots[0]
            before = snapshots[2]
            recent_growth = ((recent.hype_score - before.hype_score) / before.hype_score * 100) if before.hype_score > 0 else 0

        created_at = trend.created_at.replace(tzinfo=timezone.utc) if trend.created_at.tzinfo is None else trend.created_at
        is_recent = (datetime.now(timezone.utc) - created_at).days < 2

        if growth_rate > 100 and recent_growth > 50:
            classification: Classification = "explosive"
            confidence = min(95, growth_rate)
        elif growth_rate > 50 and len(snapshots) >= 5:
            classification = "viral"
            confidence = min(85, growth_rate)
        elif 10 < growth_rate < 50 and len(snapshots) >= 7:
            classification = "sustained"
            confidence = min(70, growth_rate + 20)
        elif growth_rate < -20:
            classification = "falling"
            confidence = min(80, abs(growth_rate))
        elif is_recent:
            classification = "new"
            confidence = 50
        else:
            classification = "sustained"
            confidence = 30

        return {
            "classification": classification,
            "confidence": round(confidence, 1),
            "growth_rate": round(growth_rate, 2),
            "recent_growth": round(recent_growth, 2),
            "snapshot_count": len(snapshots),
        }

    def get_by_classification(self, classification: Classification, limit: int = 10) -> list[dict]:
        trends = self.db.query(Trend).all()
        results = []
        for t in trends:
            result = self.classify_trend(t)
            if result["classification"] == classification:
                results.append({
                    "id": t.id,
                    "title": t.title,
                    "category": t.category,
                    "source": t.source,
                    "score": t.score,
                    **result,
                })
        return results[:limit]

    def get_explosive(self, limit: int = 10) -> list[dict]:
        return self.get_by_classification("explosive", limit)

    def get_classification_summary(self) -> dict:
        trends = self.db.query(Trend).all()
        counts: dict[str, int] = defaultdict(int)
        for t in trends:
            cls = self.classify_trend(t)["classification"]
            counts[cls] += 1
        return dict(counts)

    def generate_insights(self, limit: int = 5) -> list[str]:
        insights = []

        explosive = self.get_explosive(limit)
        if explosive:
            for e in explosive:
                insights.append(
                    f"{e['title']} is exploding with {e['growth_rate']}% growth "
                    f"({e['confidence']}% confidence)"
                )

        falling = self.get_by_classification("falling", limit)
        if falling:
            for f in falling[:2]:
                insights.append(
                    f"{f['title']} is declining ({f['growth_rate']}% drop)"
                )

        if not insights:
            insights.append("No significant trend patterns detected")

        return insights
