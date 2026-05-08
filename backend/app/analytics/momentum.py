"""
Momentum Detection Engine

Measures the velocity and acceleration of trend growth.
  - High Momentum: sustained growth over multiple snapshots
  - Accelerating: growth rate is increasing
  - Decelerating: growth rate is decreasing
  - Low Momentum: minimal or negative growth
"""

from datetime import datetime, timezone
from typing import Literal

from sqlalchemy.orm import Session

from app.models.analytics import Analytics
from app.models.trend import Trend

Momentum = Literal["accelerating", "high", "decelerating", "low"]


class MomentumEngine:
    def __init__(self, db: Session):
        self.db = db

    def calculate_momentum(self, trend_id: int, lookback: int = 5) -> dict:
        snapshots = (
            self.db.query(Analytics)
            .filter(Analytics.trend_id == trend_id)
            .order_by(Analytics.created_at.desc())
            .limit(lookback + 1)
            .all()
        )

        if len(snapshots) < 3:
            return {"momentum": "low", "velocity": 0, "acceleration": 0}

        recent = snapshots[:lookback]
        velocities = []
        for i in range(1, len(recent)):
            v = recent[i - 1].growth_rate - recent[i].growth_rate
            velocities.append(v)

        avg_velocity = sum(velocities) / len(velocities) if velocities else 0

        if len(velocities) >= 2:
            acceleration = velocities[0] - velocities[-1]
        else:
            acceleration = 0

        if avg_velocity > 10 and acceleration > 0:
            momentum: Momentum = "accelerating"
        elif avg_velocity > 5:
            momentum = "high"
        elif avg_velocity > 0:
            momentum = "decelerating"
        else:
            momentum = "low"

        return {
            "momentum": momentum,
            "velocity": round(avg_velocity, 2),
            "acceleration": round(acceleration, 2),
        }

    def analyze_all(self) -> list[dict]:
        trends = self.db.query(Trend).all()
        results = []
        for t in trends:
            m = self.calculate_momentum(t.id)
            results.append({
                "id": t.id,
                "title": t.title,
                "category": t.category,
                **m,
            })
        return sorted(results, key=lambda x: x["velocity"], reverse=True)

    def get_high_momentum(self, limit: int = 10) -> list[dict]:
        return [r for r in self.analyze_all() if r["momentum"] in ("accelerating", "high")][:limit]
