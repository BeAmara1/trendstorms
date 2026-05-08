import unittest
from unittest.mock import patch, MagicMock

from app.collectors.base_collector import BaseCollector
from app.collectors.spotify_collector import SpotifyCollector
from app.collectors.steam_collector import SteamCollector
from app.collectors.rawg_collector import RAWGCollector
from app.collectors.tmdb_collector import TMDBCollector
from app.collectors.trends_collector import TrendsCollector


class TestBaseCollector(unittest.TestCase):
    def test_normalize_output_structure(self):
        class TestCollector(BaseCollector):
            def fetch_data(self):
                return []

        c = TestCollector("test")
        item = c.normalize("Title", "music", "test_source", 85.0, 10.5)
        self.assertIn("title", item)
        self.assertIn("category", item)
        self.assertIn("source", item)
        self.assertIn("score", item)
        self.assertIn("growth", item)
        self.assertIn("timestamp", item)
        self.assertEqual(item["title"], "Title")
        self.assertEqual(item["score"], 85.0)
        self.assertEqual(item["growth"], 10.5)

    def test_collect_returns_empty_on_error(self):
        class FailingCollector(BaseCollector):
            def fetch_data(self):
                raise RuntimeError("API down")

        c = FailingCollector("failing")
        result = c.collect()
        self.assertEqual(result, [])


@patch("app.collectors.spotify_collector.spotipy.Spotify")
class TestSpotifyCollector(unittest.TestCase):
    def test_get_top_tracks(self, mock_spotify):
        mock_instance = MagicMock()
        mock_spotify.return_value = mock_instance
        mock_instance.search.return_value = {
            "tracks": {
                "items": [
                    {
                        "name": "Test Track",
                        "popularity": 85,
                        "artists": [{"name": "Test Artist"}],
                        "album": {
                            "images": [{"url": "https://img.url"}],
                        },
                        "external_urls": {"spotify": "https://spotify.url"},
                    }
                ]
            }
        }
        c = SpotifyCollector()
        tracks = c.get_top_tracks(limit=1)
        self.assertEqual(len(tracks), 1)
        self.assertEqual(tracks[0]["title"], "Test Track")
        self.assertEqual(tracks[0]["source"], "spotify")


@patch("app.collectors.steam_collector.requests.get")
class TestSteamCollector(unittest.TestCase):
    def test_get_top_games(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "response": {
                "ranks": [
                    {
                        "appid": 730,
                        "concurrent_in_game": 500000,
                        "percent_change": 5.2,
                        "peak_in_game": 1000000,
                    }
                ]
            }
        }
        mock_get.return_value = mock_response

        c = SteamCollector()
        games = c.get_top_games(limit=1)
        self.assertIsInstance(games, list)


@patch("app.collectors.rawg_collector.requests.get")
class TestRAWGCollector(unittest.TestCase):
    def test_get_popular_games(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "results": [
                {
                    "name": "Test Game",
                    "rating": 4.5,
                    "ratings_count": 1000,
                    "genres": [{"name": "Action"}],
                    "platforms": [{"platform": {"name": "PC"}}],
                    "released": "2024-01-01",
                    "background_image": "https://img.url",
                    "metacritic": 90,
                }
            ]
        }
        mock_get.return_value = mock_response

        c = RAWGCollector()
        games = c.get_popular_games(limit=1)
        self.assertEqual(len(games), 1)
        self.assertEqual(games[0]["title"], "Test Game")


@patch("app.collectors.tmdb_collector.requests.get")
class TestTMDBCollector(unittest.TestCase):
    def test_get_trending_movies(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "results": [
                {
                    "title": "Test Movie",
                    "original_title": "Test Movie",
                    "vote_average": 8.5,
                    "popularity": 500,
                    "overview": "A test movie",
                    "poster_path": "/poster.jpg",
                    "release_date": "2024-06-15",
                    "genre_ids": [28, 12],
                    "vote_count": 2000,
                }
            ]
        }
        mock_get.return_value = mock_response

        c = TMDBCollector()
        movies = c.get_trending_movies(limit=1)
        self.assertEqual(len(movies), 1)
        self.assertEqual(movies[0]["title"], "Test Movie")
        self.assertEqual(movies[0]["source"], "tmdb")


class TestTrendsCollector(unittest.TestCase):
    def test_compare_keywords_empty_on_error(self):
        c = TrendsCollector()
        result = c.compare_keywords([])
        self.assertEqual(result, [])


if __name__ == "__main__":
    unittest.main()
