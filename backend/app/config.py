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

    ENV: str = os.getenv("ENV", "development")

    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    )

    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")

    @property
    def is_production(self) -> bool:
        return self.ENV == "production"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def database_url_override(self) -> str | None:
        return os.getenv("DATABASE_URL")


settings = Settings()
