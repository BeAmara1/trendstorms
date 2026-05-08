"""
Basic Forecasting Engine

Simple prediction methods:
  - Moving average
  - Linear trend projection
  - Growth rate extrapolation
"""

from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.models.analytics import Analytics
from app.models.trend import Trend


class Forecasting:
    def __init__(self, db: Session):
        self.db = db

    def moving_average(self, values: list[float], window: int = 3) -> list[float]:
        if len(values) < window:
            return values
        result = []
        for i in range(len(values)):
            start = max(0, i - window + 1)
            subset = values[start:i + 1]
            result.append(sum(subset) / len(subset))
        return result

    def linear_trend(self, values: list[float], steps: int = 3) -> list[float]:
        n = len(values)
        if n < 2:
            return values + [values[-1]] * steps if values else []

        x = list(range(n))
        y = values
        x_mean = sum(x) / n
        y_mean = sum(y) / n

        num = sum((x[i] - x_mean) * (y[i] - y_mean) for i in range(n))
        den = sum((x[i] - x_mean) ** 2 for i in range(n))

        slope = num / den if den != 0 else 0
        intercept = y_mean - slope * x_mean

        predictions = []
        for i in range(1, steps + 1):
            pred = slope * (n - 1 + i) + intercept
            predictions.append(round(max(0, pred), 2))

        return predictions

    def predict_trend(self, trend_id: int, steps: int = 5) -> dict[str, Any]:
        snapshots = (
            self.db.query(Analytics)
            .filter(Analytics.trend_id == trend_id)
            .order_by(Analytics.created_at.asc())
            .all()
        )

        if not snapshots:
            return {"trend_id": trend_id, "error": "No data available"}

        hype_values = [s.hype_score for s in snapshots]
        growth_values = [s.growth_rate for s in snapshots]

        smoothed = self.moving_average(hype_values)
        predictions = self.linear_trend(hype_values, steps)

        trend = self.db.query(Trend).filter(Trend.id == trend_id).first()

        return {
            "trend_id": trend_id,
            "title": trend.title if trend else "Unknown",
            "current_hype": hype_values[-1] if hype_values else 0,
            "average_hype": round(sum(hype_values) / len(hype_values), 2) if hype_values else 0,
            "smoothed": smoothed,
            "predictions": predictions,
            "trend_direction": "up" if predictions and predictions[-1] > hype_values[-1] else "down",
            "steps_analyzed": len(hype_values),
            "forecast_steps": steps,
        }

    def predict_all(self, steps: int = 3) -> list[dict[str, Any]]:
        trends = self.db.query(Trend).all()
        results = []
        for t in trends:
            result = self.predict_trend(t.id, steps)
            if "error" not in result:
                results.append(result)
        return sorted(results, key=lambda x: x.get("trend_direction", "") == "up", reverse=True)
