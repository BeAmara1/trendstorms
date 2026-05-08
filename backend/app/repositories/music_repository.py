from sqlalchemy.orm import Session

from app.models.music import Music


class MusicRepository:
    def __init__(self, db: Session):
        self.db = db

    def save_music(self, data: dict) -> Music:
        existing = self.get_by_spotify_id(str(data.get("spotify_id", "")))
        if existing:
            existing.popularity = data.get("popularity", existing.popularity)
            self.db.commit()
            self.db.refresh(existing)
            return existing

        music = Music(
            track_name=data["track_name"],
            artist_name=data["artist_name"],
            genre=data.get("genre"),
            popularity=data.get("popularity", 0),
            spotify_id=str(data.get("spotify_id", "")),
            image_url=data.get("image_url"),
        )
        self.db.add(music)
        self.db.commit()
        self.db.refresh(music)
        return music

    def get_top_tracks(self, limit: int = 20) -> list[Music]:
        return (
            self.db.query(Music)
            .order_by(Music.popularity.desc())
            .limit(limit)
            .all()
        )

    def get_by_spotify_id(self, spotify_id: str) -> Music | None:
        return (
            self.db.query(Music)
            .filter(Music.spotify_id == spotify_id)
            .first()
        )
