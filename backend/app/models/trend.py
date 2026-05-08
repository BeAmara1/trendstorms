from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Trend(Base):
    __tablename__ = "trends"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    source: Mapped[str] = mapped_column(String(50), nullable=False)
    score: Mapped[float] = mapped_column(Float, default=0.0, index=True)
    growth: Mapped[float] = mapped_column(Float, default=0.0)
    extra_data: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )

    analytics: Mapped[list["Analytics"]] = relationship(
        "Analytics", back_populates="trend", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("idx_trend_title_category", "title", "category"),
    )

    def __repr__(self) -> str:
        return f"<Trend(id={self.id}, title='{self.title}', category='{self.category}')>"
