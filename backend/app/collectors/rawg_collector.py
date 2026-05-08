import requests

from app.collectors.base_collector import BaseCollector
from app.config import settings

RAWG_API_URL = "https://api.rawg.io/api"


class RAWGCollector(BaseCollector):
    def __init__(self):
        super().__init__("rawg")
        self.api_key = settings.RAWG_API_KEY

    def get_popular_games(self, limit: int = 20) -> list[dict]:
        url = f"{RAWG_API_URL}/games"
        params = {
            "key": self.api_key,
            "page_size": limit,
            "ordering": "-rating",
        }
        try:
            resp = requests.get(url, params=params, timeout=15)
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as e:
            self.logger.error("RAWG API error: %s", str(e))
            return []

        games = []
        for item in data.get("results", []):
            games.append(
                self.normalize(
                    title=item["name"],
                    category="game",
                    source="rawg",
                    score=item.get("rating", 0) * 20,
                    growth=item.get("ratings_count", 0),
                    extra={
                        "genres": [g["name"] for g in item.get("genres", [])],
                        "platforms": [p["platform"]["name"] for p in item.get("platforms", [])],
                        "rating": item.get("rating"),
                        "released": item.get("released"),
                        "image": item.get("background_image"),
                        "metacritic": item.get("metacritic"),
                    },
                )
            )
        return games

    def get_game_details(self, game_id: int) -> dict | None:
        url = f"{RAWG_API_URL}/games/{game_id}"
        try:
            resp = requests.get(url, params={"key": self.api_key}, timeout=10)
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            self.logger.error("RAWG game detail error for %d: %s", game_id, str(e))
            return None

    def fetch_data(self) -> list[dict]:
        return self.get_popular_games()
