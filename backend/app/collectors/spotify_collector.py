import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from app.collectors.base_collector import BaseCollector
from app.config import settings


class SpotifyCollector(BaseCollector):
    def __init__(self):
        super().__init__("spotify")
        self.client = spotipy.Spotify(
            client_credentials_manager=SpotifyClientCredentials(
                client_id=settings.SPOTIFY_CLIENT_ID,
                client_secret=settings.SPOTIFY_CLIENT_SECRET,
            )
        )

    def get_top_tracks(self, limit: int = 20) -> list[dict]:
        results = self.client.search(q="genre:pop", type="track", limit=limit)
        tracks = []
        for item in results.get("tracks", {}).get("items", []):
            tracks.append(
                self.normalize(
                    title=item["name"],
                    category="music",
                    source="spotify",
                    score=item["popularity"],
                    extra={
                        "artist": item["artists"][0]["name"],
                        "image": item["album"]["images"][0]["url"] if item["album"]["images"] else None,
                        "url": item["external_urls"]["spotify"],
                    },
                )
            )
        return tracks

    def get_top_artists(self, limit: int = 20) -> list[dict]:
        results = self.client.search(q="genre:pop", type="artist", limit=limit)
        artists = []
        for item in results.get("artists", {}).get("items", []):
            artists.append(
                self.normalize(
                    title=item["name"],
                    category="artist",
                    source="spotify",
                    score=item["popularity"],
                    extra={
                        "genres": item["genres"],
                        "image": item["images"][0]["url"] if item["images"] else None,
                        "followers": item["followers"]["total"],
                    },
                )
            )
        return artists

    def get_new_releases(self, limit: int = 20) -> list[dict]:
        results = self.client.new_releases(limit=limit)
        releases = []
        for item in results.get("albums", {}).get("items", []):
            releases.append(
                self.normalize(
                    title=item["name"],
                    category="album",
                    source="spotify",
                    score=0,
                    extra={
                        "artist": item["artists"][0]["name"],
                        "image": item["images"][0]["url"] if item["images"] else None,
                        "release_date": item["release_date"],
                        "url": item["external_urls"]["spotify"],
                    },
                )
            )
        return releases

    def fetch_data(self) -> list[dict]:
        return self.get_top_tracks()
