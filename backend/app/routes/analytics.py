from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_session
from app.schemas.analytics_schema import AnalyticsResponse, HypeScoreResponse, HistoryPoint
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
