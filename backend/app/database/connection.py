from sqlalchemy import create_engine

from app.config import settings


def get_database_url() -> str:
    url = settings.DATABASE_URL
    if not url or url == "sqlite:///./test.db":
        return "sqlite:///./test.db"
    return url


DATABASE_URL = get_database_url()

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=not DATABASE_URL.startswith("sqlite"),
    pool_size=5,
    max_overflow=10,
    connect_args=connect_args or None,
)
