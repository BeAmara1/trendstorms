from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_session
from app.schemas.analytics_schema import (
    AnalyticsResponse,
    CorrelationResponse,
    ForecastResponse,
    GrowthClassificationResponse,
    HistoryPoint,
    HypeScoreResponse,
    InsightResponse,
    MomentumResponse,
)
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/hype-score", response_model=list[HypeScoreResponse])
def hype_scores(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_session),
):
    service = AnalyticsService(db)
    return service.get_hype_scores(limit)


@router.get("/growth", response_model=list[HypeScoreResponse])
def top_growing(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_session),
):
    service = AnalyticsService(db)
    return service.get_top_growing(limit)


@router.get("/history/{trend_id}", response_model=list[HistoryPoint])
def trend_history(
    trend_id: int,
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_session),
):
    service = AnalyticsService(db)
    return service.get_history(trend_id, limit)


@router.get("/exploding", response_model=list[GrowthClassificationResponse])
def exploding_trends(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_session),
):
    service = AnalyticsService(db)
    return service.get_exploding(limit)


@router.get("/momentum", response_model=list[MomentumResponse])
def momentum_trends(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_session),
):
    service = AnalyticsService(db)
    return service.get_momentum(limit)


@router.get("/correlations", response_model=list[CorrelationResponse])
def correlations(
    threshold: float = Query(0.3, ge=0.0, le=1.0),
    db: Session = Depends(get_session),
):
    service = AnalyticsService(db)
    return service.get_correlations(threshold)


@router.get("/insights", response_model=InsightResponse)
def insights(
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_session),
):
    service = AnalyticsService(db)
    return service.get_insights(limit)


@router.get("/forecast/{trend_id}", response_model=ForecastResponse)
def forecast(
    trend_id: int,
    steps: int = Query(5, ge=1, le=30),
    db: Session = Depends(get_session),
):
    service = AnalyticsService(db)
    return service.get_forecast(trend_id, steps)
