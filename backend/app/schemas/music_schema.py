from datetime import datetime

from pydantic import BaseModel


class MusicBase(BaseModel):
    track_name: str
    artist_name: str
    genre: str | None = None
    popularity: int = 0


class MusicCreate(MusicBase):
    spotify_id: str | None = None
    image_url: str | None = None


class MusicResponse(MusicBase):
    id: int
    spotify_id: str | None = None
    image_url: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class MusicList(BaseModel):
    items: list[MusicResponse]
    total: int
    page: int
    limit: int
