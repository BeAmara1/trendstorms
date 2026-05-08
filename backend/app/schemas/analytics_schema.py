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


class GrowthClassificationResponse(BaseModel):
    id: int
    title: str
    category: str
    growth: float
    classification: str
    score: float


class MomentumResponse(BaseModel):
    id: int
    title: str
    category: str
    momentum: str
    velocity: float
    acceleration: float


class CorrelationResponse(BaseModel):
    title: str
    category: str
    sources: list[str]
    source_count: int
    avg_growth: float
    avg_score: float
    correlation_score: float


class InsightResponse(BaseModel):
    insights: list[str]


class ForecastPoint(BaseModel):
    value: float


class ForecastResponse(BaseModel):
    trend_id: int
    title: str
    current_hype: float
    average_hype: float
    smoothed: list[float]
    predictions: list[float]
    trend_direction: str
    steps_analyzed: int
    forecast_steps: int
