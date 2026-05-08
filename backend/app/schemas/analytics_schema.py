from datetime import datetime

from pydantic import BaseModel


class AnalyticsResponse(BaseModel):
    id: int
    trend_id: int
    hype_score: float
    growth_rate: float
    sentiment_score: float
    created_at: datetime

    model_config = {"from_attributes": True}


class HistoryPoint(BaseModel):
    date: str
    score: float
    growth: float


class HypeScoreResponse(BaseModel):
    title: str
    category: str
    hype_score: float
    growth_rate: float
