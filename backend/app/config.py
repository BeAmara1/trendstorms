import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))


class Settings:
    SPOTIFY_CLIENT_ID: str = os.getenv("SPOTIFY_CLIENT_ID", "")
    SPOTIFY_CLIENT_SECRET: str = os.getenv("SPOTIFY_CLIENT_SECRET", "")

    TMDB_API_KEY: str = os.getenv("TMDB_API_KEY", "")

    RAWG_API_KEY: str = os.getenv("RAWG_API_KEY", "")

    STEAM_API_KEY: str = os.getenv("STEAM_API_KEY", "")

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://postgres:password@localhost:5432/trendpulse_db"
    )


settings = Settings()
