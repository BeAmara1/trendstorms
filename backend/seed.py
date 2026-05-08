"""Seed script to populate the database with sample data for testing."""
from datetime import datetime, timezone

from app.database.connection import engine
from app.database.base import Base
from app.database.session import SessionLocal
from app.models.trend import Trend
from app.models.game import Game
from app.models.music import Music
from app.models.movie import Movie
from app.models.analytics import Analytics


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        existing = db.query(Trend).count()
        if existing > 0:
            print(f"Database already has {existing} trends. Skipping seed.")
            return

        trends = [
            Trend(title="Minecraft", category="game", source="steam", score=95.0, growth=12.5),
            Trend(title="Taylor Swift", category="music", source="spotify", score=98.0, growth=25.0),
            Trend(title="The Last of Us", category="tv", source="tmdb", score=92.0, growth=8.3),
            Trend(title="Dune: Part Two", category="movie", source="tmdb", score=88.0, growth=15.0),
            Trend(title="Counter-Strike 2", category="game", source="steam", score=90.0, growth=5.0),
            Trend(title="Bad Bunny", category="music", source="spotify", score=85.0, growth=18.0),
            Trend(title="Elden Ring", category="game", source="rawg", score=94.0, growth=3.0),
            Trend(title="AI Art", category="trending_search", source="google_trends", score=75.0, growth=45.0),
        ]
        db.add_all(trends)
        db.commit()

        for t in trends:
            db.refresh(t)

        games = [
            Game(title="Minecraft", genre="Sandbox", steam_players=120000, rating=4.8, release_date="2011-11-18"),
            Game(title="Counter-Strike 2", genre="FPS", steam_players=800000, rating=4.6, release_date="2023-09-27"),
            Game(title="Elden Ring", genre="Action RPG", steam_players=95000, rating=4.9, release_date="2022-02-25"),
        ]
        db.add_all(games)
        db.commit()

        music = [
            Music(track_name="Cruel Summer", artist_name="Taylor Swift", genre="Pop", popularity=95, spotify_id="1"),
            Music(track_name="Monaco", artist_name="Bad Bunny", genre="Reggaeton", popularity=88, spotify_id="2"),
        ]
        db.add_all(music)
        db.commit()

        movies = [
            Movie(title="Dune: Part Two", media_type="movie", rating=8.8, popularity=500),
            Movie(title="The Last of Us", media_type="tv", rating=9.0, popularity=800),
        ]
        db.add_all(movies)
        db.commit()

        analytics_list = []
        for t in trends:
            analytics_list.append(
                Analytics(
                    trend_id=t.id,
                    hype_score=t.score,
                    growth_rate=t.growth,
                    sentiment_score=0.7,
                )
            )
        db.add_all(analytics_list)
        db.commit()

        print(f"Seed complete: {len(trends)} trends, {len(games)} games, {len(music)} music, {len(movies)} movies, {len(analytics_list)} analytics")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
