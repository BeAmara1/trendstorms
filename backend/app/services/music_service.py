from sqlalchemy.orm import Session

from app.models.music import Music
from app.repositories.music_repository import MusicRepository


class MusicService:
    def __init__(self, db: Session):
        self.repo = MusicRepository(db)

    def get_all(self, genre: str | None = None, sort: str = "popularity", page: int = 1, limit: int = 20) -> tuple[list[Music], int]:
        query = self.repo.db.query(Music)

        if genre:
            query = query.filter(Music.genre == genre)

        total = query.count()

        sort_map = {
            "popularity": Music.popularity.desc(),
            "newest": Music.created_at.desc(),
        }
        order = sort_map.get(sort, Music.popularity.desc())
        query = query.order_by(order)

        offset = (page - 1) * limit
        items = query.offset(offset).limit(limit).all()

        return items, total

    def get_top(self, limit: int = 20) -> list[Music]:
        return self.repo.db.query(Music).order_by(Music.popularity.desc()).limit(limit).all()

    def get_artists(self, limit: int = 20) -> list[Music]:
        return self.repo.db.query(Music).order_by(Music.popularity.desc()).limit(limit).all()

    def get_genres(self) -> list[str]:
        results = self.repo.db.query(Music.genre).distinct().all()
        return [r[0] for r in results if r[0]]
