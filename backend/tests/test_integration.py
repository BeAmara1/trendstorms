import unittest

from app.collectors.base_collector import BaseCollector
from app.collectors.spotify_collector import SpotifyCollector
from app.collectors.steam_collector import SteamCollector
from app.collectors.rawg_collector import RAWGCollector
from app.collectors.tmdb_collector import TMDBCollector
from app.collectors.trends_collector import TrendsCollector


class TestCollectorInitialization(unittest.TestCase):
    def test_spotify_collector_inits(self):
        c = SpotifyCollector()
        self.assertEqual(c.name, "spotify")

    def test_steam_collector_inits(self):
        c = SteamCollector()
        self.assertEqual(c.name, "steam")

    def test_rawg_collector_inits(self):
        c = RAWGCollector()
        self.assertEqual(c.name, "rawg")

    def test_tmdb_collector_inits(self):
        c = TMDBCollector()
        self.assertEqual(c.name, "tmdb")

    def test_trends_collector_inits(self):
        c = TrendsCollector()
        self.assertEqual(c.name, "google_trends")

    def test_all_collectors_are_base_collector_subclasses(self):
        collectors = [
            SpotifyCollector(),
            SteamCollector(),
            RAWGCollector(),
            TMDBCollector(),
            TrendsCollector(),
        ]
        for c in collectors:
            self.assertIsInstance(c, BaseCollector)

    def test_all_collectors_have_collect_method(self):
        collectors = [
            SpotifyCollector(),
            SteamCollector(),
            RAWGCollector(),
            TMDBCollector(),
            TrendsCollector(),
        ]
        for c in collectors:
            self.assertTrue(hasattr(c, "collect"))
            self.assertTrue(hasattr(c, "fetch_data"))
            self.assertTrue(hasattr(c, "normalize"))


if __name__ == "__main__":
    unittest.main()
