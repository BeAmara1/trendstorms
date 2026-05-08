from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Analytics(Base):
    __tablename__ = "analytics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    trend_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("trends.id", ondelete="CASCADE"), nullable=False, index=True
    )
    hype_score: Mapped[float] = mapped_column(Float, default=0.0)
    growth_rate: Mapped[float] = mapped_column(Float, default=0.0)
    sentiment_score: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    trend: Mapped["Trend"] = relationship("Trend", back_populates="analytics")

    def __repr__(self) -> str:
        return f"<Analytics(id={self.id}, trend_id={self.trend_id}, hype={self.hype_score})>"
