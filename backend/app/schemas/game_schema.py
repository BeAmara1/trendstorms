from datetime import datetime

from pydantic import BaseModel


class GameBase(BaseModel):
    title: str
    genre: str | None = None
    steam_players: int = 0
    rating: float = 0.0


class GameCreate(GameBase):
    release_date: str | None = None
    image_url: str | None = None
    source_id: str | None = None


class GameResponse(GameBase):
    id: int
    release_date: str | None = None
    image_url: str | None = None
    source_id: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class GameList(BaseModel):
    items: list[GameResponse]
    total: int
    page: int
    limit: int
