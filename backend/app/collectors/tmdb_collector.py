import requests

from app.collectors.base_collector import BaseCollector
from app.config import settings

TMDB_API_URL = "https://api.themoviedb.org/3"


class TMDBCollector(BaseCollector):
    def __init__(self):
        super().__init__("tmdb")
        self.api_key = settings.TMDB_API_KEY

    def get_trending_movies(self, limit: int = 20) -> list[dict]:
        url = f"{TMDB_API_URL}/trending/movie/week"
        try:
            resp = requests.get(
                url, params={"api_key": self.api_key}, timeout=15
            )
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as e:
            self.logger.error("TMDB movie error: %s", str(e))
            return []

        movies = []
        for item in data.get("results", [])[:limit]:
            movies.append(
                self.normalize(
                    title=item.get("title", item.get("original_title", "Unknown")),
                    category="movie",
                    source="tmdb",
                    score=item.get("vote_average", 0) * 10,
                    growth=item.get("popularity", 0),
                    extra={
                        "overview": item.get("overview"),
                        "image": f"https://image.tmdb.org/t/p/w500{item['poster_path']}" if item.get("poster_path") else None,
                        "release_date": item.get("release_date"),
                        "genre_ids": item.get("genre_ids", []),
                        "vote_count": item.get("vote_count", 0),
                    },
                )
            )
        return movies

    def get_popular_tv(self, limit: int = 20) -> list[dict]:
        url = f"{TMDB_API_URL}/trending/tv/week"
        try:
            resp = requests.get(
                url, params={"api_key": self.api_key}, timeout=15
            )
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as e:
            self.logger.error("TMDB TV error: %s", str(e))
            return []

        shows = []
        for item in data.get("results", [])[:limit]:
            shows.append(
                self.normalize(
                    title=item.get("name", item.get("original_name", "Unknown")),
                    category="tv",
                    source="tmdb",
                    score=item.get("vote_average", 0) * 10,
                    growth=item.get("popularity", 0),
                    extra={
                        "overview": item.get("overview"),
                        "image": f"https://image.tmdb.org/t/p/w500{item['poster_path']}" if item.get("poster_path") else None,
                        "first_air_date": item.get("first_air_date"),
                        "genre_ids": item.get("genre_ids", []),
                        "vote_count": item.get("vote_count", 0),
                    },
                )
            )
        return shows

    def fetch_data(self) -> list[dict]:
        return self.get_trending_movies()
