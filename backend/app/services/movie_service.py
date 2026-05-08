from sqlalchemy.orm import Session

from app.models.movie import Movie
from app.repositories.movies_repository import MoviesRepository


class MovieService:
    def __init__(self, db: Session):
        self.repo = MoviesRepository(db)

    def get_all(self, media_type: str | None = None, sort: str = "popularity", page: int = 1, limit: int = 20) -> tuple[list[Movie], int]:
        query = self.repo.db.query(Movie)

        if media_type:
            query = query.filter(Movie.media_type == media_type)

        total = query.count()

        sort_map = {
            "popularity": Movie.popularity.desc(),
            "rating": Movie.rating.desc(),
            "newest": Movie.created_at.desc(),
        }
        order = sort_map.get(sort, Movie.popularity.desc())
        query = query.order_by(order)

        offset = (page - 1) * limit
        items = query.offset(offset).limit(limit).all()

        return items, total

    def get_by_id(self, movie_id: int) -> Movie | None:
        return self.repo.db.query(Movie).filter(Movie.id == movie_id).first()

    def get_trending(self, limit: int = 20) -> list[Movie]:
        return self.repo.db.query(Movie).order_by(Movie.popularity.desc()).limit(limit).all()
