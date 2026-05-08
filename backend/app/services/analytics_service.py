from sqlalchemy.orm import Session

from app.analytics import (
    CorrelationEngine,
    Forecasting,
    GrowthAnalysis,
    HypeScoreEngine,
    MomentumEngine,
    TrendDetection,
)
from app.models.analytics import Analytics
from app.models.trend import Trend
from app.services.snapshot_service import SnapshotService


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db
        self.snapshot = SnapshotService(db)
        self.hype_engine = HypeScoreEngine(db)
        self.growth_engine = GrowthAnalysis(db)
        self.momentum_engine = MomentumEngine(db)
        self.trend_detection = TrendDetection(db)
        self.correlation_engine = CorrelationEngine(db)
        self.forecasting = Forecasting(db)

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

    # ---- New engine methods ----

    def get_exploding(self, limit: int = 10) -> list[dict]:
        return self.growth_engine.get_exploding(limit)

    def get_momentum(self, limit: int = 10) -> list[dict]:
        return self.momentum_engine.get_high_momentum(limit)

    def get_all_momentum(self) -> list[dict]:
        return self.momentum_engine.analyze_all()

    def get_correlations(self, threshold: float = 0.3) -> list[dict]:
        return self.correlation_engine.find_correlations(threshold)

    def get_insights(self, limit: int = 5) -> dict:
        trend_insights = self.trend_detection.generate_insights(limit)
        corr_insights = self.correlation_engine.generate_correlation_insights()
        return {
            "trend_insights": trend_insights,
            "correlation_insights": corr_insights,
        }

    def get_forecast(self, trend_id: int, steps: int = 5) -> dict:
        return self.forecasting.predict_trend(trend_id, steps)

    def get_growth_summary(self) -> dict:
        return self.growth_engine.get_growth_summary()

    def get_classification_summary(self) -> dict:
        return self.trend_detection.get_classification_summary()
