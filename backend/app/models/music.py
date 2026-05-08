from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Music(Base):
    __tablename__ = "music"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    track_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    artist_name: Mapped[str] = mapped_column(String(255), nullable=False)
    genre: Mapped[str | None] = mapped_column(String(100), nullable=True)
    popularity: Mapped[int] = mapped_column(Integer, default=0)
    spotify_id: Mapped[str | None] = mapped_column(String(100), nullable=True, unique=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return f"<Music(id={self.id}, track='{self.track_name}', artist='{self.artist_name}')>"
