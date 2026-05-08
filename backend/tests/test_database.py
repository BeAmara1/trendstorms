import unittest
from unittest.mock import MagicMock, patch
from datetime import datetime, timezone

from app.models.trend import Trend
from app.models.game import Game
from app.models.music import Music
from app.models.movie import Movie
from app.models.analytics import Analytics
from app.repositories.trends_repository import TrendsRepository
from app.repositories.games_repository import GamesRepository
from app.repositories.music_repository import MusicRepository
from app.repositories.movies_repository import MoviesRepository
from app.services.snapshot_service import SnapshotService


class TestModels(unittest.TestCase):
    def test_trend_model(self):
        t = Trend(title="Test", category="music", source="spotify", score=90.0, growth=10.0)
        self.assertEqual(t.title, "Test")
        self.assertEqual(t.category, "music")
        self.assertEqual(t.source, "spotify")

    def test_game_model(self):
        g = Game(title="Test Game", genre="Action", steam_players=50000, rating=4.5)
        self.assertEqual(g.title, "Test Game")
        self.assertEqual(g.steam_players, 50000)

    def test_music_model(self):
        m = Music(track_name="Song", artist_name="Artist", genre="Pop", popularity=90)
        self.assertEqual(m.track_name, "Song")
        self.assertEqual(m.artist_name, "Artist")

    def test_movie_model(self):
        m = Movie(title="Test Movie", media_type="movie", rating=8.5, popularity=100)
        self.assertEqual(m.title, "Test Movie")
        self.assertEqual(m.media_type, "movie")

    def test_analytics_model(self):
        a = Analytics(trend_id=1, hype_score=85.0, growth_rate=12.0, sentiment_score=0.8)
        self.assertEqual(a.trend_id, 1)
        self.assertEqual(a.hype_score, 85.0)

    def test_trend_repr(self):
        t = Trend(title="Test", category="game", source="steam")
        self.assertIn("Test", repr(t))

    def test_analytics_trend_relationship(self):
        t = Trend(title="Rel", category="test", source="test")
        a = Analytics(trend_id=0, hype_score=50.0, growth_rate=5.0, sentiment_score=0.5)
        t.analytics.append(a)
        self.assertEqual(len(t.analytics), 1)


class TestTrendsRepository(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()
        self.repo = TrendsRepository(self.db)

    def test_save_trend(self):
        self.db.add.return_value = None
        self.db.commit.return_value = None

        mock_query = MagicMock()
        self.db.query.return_value = mock_query
        mock_query.order_by.return_value = mock_query
        mock_query.limit.return_value = []

        data = {
            "title": "Test",
            "category": "music",
            "source": "spotify",
            "score": 85.0,
            "growth": 10.0,
            "extra": {"artist": "Someone"},
        }
        result = self.repo.save_trend(data)
        self.db.add.assert_called_once()
        self.db.commit.assert_called_once()
        self.assertIsInstance(result, Trend)


class TestSnapshotService(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()
        self.service = SnapshotService(self.db)

    def test_create_snapshot(self):
        trend = Trend(id=1, title="Test", category="music", source="spotify", score=90.0, growth=5.0)
        result = self.service.create_snapshot(trend)
        self.db.add.assert_called_once()
        self.db.commit.assert_called_once()
        self.assertIsInstance(result, Analytics)


class TestGamesRepository(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()
        self.repo = GamesRepository(self.db)

    def test_save_game_new(self):
        self.db.query.return_value.filter.return_value.first.return_value = None
        data = {"title": "New Game", "genre": "Action", "steam_players": 1000, "rating": 4.5, "source_id": "123"}
        result = self.repo.save_game(data)
        self.db.add.assert_called_once()
        self.assertIsInstance(result, Game)


class TestMoviesRepository(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()
        self.repo = MoviesRepository(self.db)

    def test_save_movie_new(self):
        self.db.query.return_value.filter.return_value.first.return_value = None
        data = {"title": "New Movie", "media_type": "movie", "rating": 8.0, "popularity": 500}
        result = self.repo.save_movie(data)
        self.db.add.assert_called_once()
        self.assertIsInstance(result, Movie)


class TestMusicRepository(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()
        self.repo = MusicRepository(self.db)

    def test_save_music_new(self):
        self.db.query.return_value.filter.return_value.first.return_value = None
        data = {"track_name": "Song", "artist_name": "Artist", "popularity": 90, "spotify_id": "abc"}
        result = self.repo.save_music(data)
        self.db.add.assert_called_once()
        self.assertIsInstance(result, Music)


if __name__ == "__main__":
    unittest.main()
