"""
Correlation Engine

Cross-references trends across different platforms to find correlations.
  - Spotify + Google Trends
  - Steam + RAWG
  - TMDB + Google Trends
  - Multi-platform alignment
"""

from collections import defaultdict
from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.models.trend import Trend
from app.services.logger import get_logger

logger = get_logger("correlation")


class CorrelationEngine:
    def __init__(self, db: Session):
        self.db = db

    def get_trends_by_source(self) -> dict[str, list[dict]]:
        trends = self.db.query(Trend).all()
        grouped: dict[str, list[dict]] = defaultdict(list)
        for t in trends:
            grouped[t.source].append({
                "id": t.id,
                "title": t.title,
                "category": t.category,
                "score": t.score,
                "growth": t.growth,
            })
        return dict(grouped)

    def find_correlations(self, threshold: float = 0.5) -> list[dict]:
        by_source = self.get_trends_by_source()
        correlations = []

        titles = set()
        for items in by_source.values():
            for item in items:
                titles.add(item["title"].lower())

        for title_lower in titles:
            matches = []
            for source, items in by_source.items():
                for item in items:
                    if item["title"].lower() == title_lower:
                        matches.append({**item, "source": source})

            if len(matches) >= 2:
                avg_growth = sum(m["growth"] for m in matches) / len(matches)
                avg_score = sum(m["score"] for m in matches) / len(matches)
                correlation_score = (avg_growth + avg_score) / 200

                if correlation_score >= threshold:
                    correlations.append({
                        "title": matches[0]["title"],
                        "category": matches[0]["category"],
                        "sources": [m["source"] for m in matches],
                        "source_count": len(matches),
                        "avg_growth": round(avg_growth, 2),
                        "avg_score": round(avg_score, 2),
                        "correlation_score": round(correlation_score, 3),
                    })

        correlations.sort(key=lambda x: x["correlation_score"], reverse=True)
        return correlations

    def find_multi_platform_trends(self, limit: int = 10) -> list[dict]:
        correlations = self.find_correlations(threshold=0.3)
        return correlations[:limit]

    def generate_correlation_insights(self) -> list[str]:
        insights = []
        correlations = self.find_correlations(threshold=0.6)

        for c in correlations[:5]:
            sources_str = ", ".join(c["sources"])
            insights.append(
                f"{c['title']} appears across {c['source_count']} platforms "
                f"({sources_str}) — correlation: {c['correlation_score']:.1%}"
            )

        if not insights:
            insights.append("No strong cross-platform correlations detected")

        return insights
