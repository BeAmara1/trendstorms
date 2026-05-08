from sqlalchemy.orm import Session

from app.models.analytics import Analytics
from app.models.trend import Trend
from app.services.snapshot_service import SnapshotService


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db
        self.snapshot = SnapshotService(db)

    def get_hype_scores(self, limit: int = 20) -> list[dict]:
        results = (
            self.db.query(Analytics)
            .order_by(Analytics.hype_score.desc())
            .limit(limit)
            .all()
        )
        output = []
        for a in results:
            trend = self.db.query(Trend).filter(Trend.id == a.trend_id).first()
            output.append({
                "title": trend.title if trend else "Unknown",
                "category": trend.category if trend else "unknown",
                "hype_score": a.hype_score,
                "growth_rate": a.growth_rate,
            })
        return output

    def get_top_growing(self, limit: int = 20) -> list[dict]:
        results = self.snapshot.get_top_growing(limit)
        output = []
        for a in results:
            trend = self.db.query(Trend).filter(Trend.id == a.trend_id).first()
            output.append({
                "title": trend.title if trend else "Unknown",
                "category": trend.category if trend else "unknown",
                "hype_score": a.hype_score,
                "growth_rate": a.growth_rate,
            })
        return output

    def get_history(self, trend_id: int, limit: int = 50) -> list[dict]:
        snapshots = self.snapshot.get_trend_history(trend_id, limit)
        return [
            {
                "date": s.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "score": s.hype_score,
                "growth": s.growth_rate,
            }
            for s in reversed(snapshots)
        ]
