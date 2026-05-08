from sqlalchemy.orm import Session

from app.models.movie import Movie


class MoviesRepository:
    def __init__(self, db: Session):
        self.db = db

    def save_movie(self, data: dict) -> Movie:
        existing = self.get_by_title_type(data["title"], data["media_type"])
        if existing:
            existing.rating = data.get("rating", existing.rating)
            existing.popularity = data.get("popularity", existing.popularity)
            self.db.commit()
            self.db.refresh(existing)
            return existing

        movie = Movie(
            title=data["title"],
            media_type=data["media_type"],
            rating=data.get("rating", 0),
            popularity=data.get("popularity", 0),
            release_date=data.get("release_date"),
            poster_url=data.get("poster_url"),
            source_id=str(data.get("source_id", "")),
        )
        self.db.add(movie)
        self.db.commit()
        self.db.refresh(movie)
        return movie

    def get_top_movies(self, limit: int = 20) -> list[Movie]:
        return (
            self.db.query(Movie)
            .filter(Movie.media_type == "movie")
            .order_by(Movie.popularity.desc())
            .limit(limit)
            .all()
        )

    def get_top_tv(self, limit: int = 20) -> list[Movie]:
        return (
            self.db.query(Movie)
            .filter(Movie.media_type == "tv")
            .order_by(Movie.popularity.desc())
            .limit(limit)
            .all()
        )

    def get_by_title_type(self, title: str, media_type: str) -> Movie | None:
        return (
            self.db.query(Movie)
            .filter(Movie.title == title, Movie.media_type == media_type)
            .first()
        )
