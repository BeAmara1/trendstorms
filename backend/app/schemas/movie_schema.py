from datetime import datetime

from pydantic import BaseModel


class MovieBase(BaseModel):
    title: str
    media_type: str
    rating: float = 0.0
    popularity: float = 0.0


class MovieCreate(MovieBase):
    release_date: str | None = None
    poster_url: str | None = None
    source_id: str | None = None


class MovieResponse(MovieBase):
    id: int
    release_date: str | None = None
    poster_url: str | None = None
    source_id: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class MovieList(BaseModel):
    items: list[MovieResponse]
    total: int
    page: int
    limit: int
