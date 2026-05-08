import requests

from app.collectors.base_collector import BaseCollector
from app.config import settings

STEAM_API_URL = "https://api.steampowered.com"
STEAM_STORE_URL = "https://store.steampowered.com/api"


class SteamCollector(BaseCollector):
    def __init__(self):
        super().__init__("steam")
        self.api_key = settings.STEAM_API_KEY

    def get_top_games(self, limit: int = 20) -> list[dict]:
        url = f"{STEAM_API_URL}/ISteamChartsService/GetMostPlayedGames/v1/"
        try:
            resp = requests.get(url, params={"key": self.api_key}, timeout=15)
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as e:
            self.logger.error("Steam API error (top games): %s", str(e))
            return []

        games = []
        for item in data.get("response", {}).get("ranks", [])[:limit]:
            app_id = item.get("appid")
            name = self._get_game_name(app_id)
            games.append(
                self.normalize(
                    title=name or f"App {app_id}",
                    category="game",
                    source="steam",
                    score=item.get("concurrent_in_game", 0),
                    growth=item.get("percent_change", 0),
                    extra={
                        "app_id": app_id,
                        "peak_in_game": item.get("peak_in_game", 0),
                    },
                )
            )
        return games

    def get_current_players(self, app_id: int) -> int:
        url = f"{STEAM_API_URL}/ISteamUserStats/GetNumberOfCurrentPlayers/v1/"
        try:
            resp = requests.get(
                url, params={"key": self.api_key, "appid": app_id}, timeout=10
            )
            resp.raise_for_status()
            return resp.json().get("response", {}).get("player_count", 0)
        except requests.RequestException as e:
            self.logger.error("Steam player count error for %d: %s", app_id, str(e))
            return 0

    def _get_game_name(self, app_id: int) -> str | None:
        url = f"{STEAM_STORE_URL}/appdetails"
        try:
            resp = requests.get(url, params={"appids": app_id}, timeout=10)
            data = resp.json()
            return data.get(str(app_id), {}).get("data", {}).get("name")
        except requests.RequestException:
            return None

    def fetch_data(self) -> list[dict]:
        return self.get_top_games()
