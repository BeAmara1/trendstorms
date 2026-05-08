from datetime import datetime

from pydantic import BaseModel


class TrendBase(BaseModel):
    title: str
    category: str
    source: str
    score: float = 0.0
    growth: float = 0.0


class TrendCreate(TrendBase):
    extra_data: str | None = None


class TrendResponse(TrendBase):
    id: int
    extra_data: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class TrendList(BaseModel):
    items: list[TrendResponse]
    total: int
    page: int
    limit: int
