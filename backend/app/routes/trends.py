from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_session
from app.schemas.trend_schema import TrendResponse, TrendList
from app.services.trend_service import TrendService

router = APIRouter(prefix="/trends", tags=["Trends"])


@router.get("", response_model=TrendList)
def list_trends(
    category: str | None = Query(None, description="Filter by category"),
    source: str | None = Query(None, description="Filter by source"),
    sort: str = Query("score", description="Sort field: score, growth, newest, oldest"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_session),
):
    service = TrendService(db)
    items, total = service.get_all(category, source, sort, page, limit)
    return TrendList(
        items=[TrendResponse.model_validate(t) for t in items],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/top", response_model=list[TrendResponse])
def top_trends(
    category: str | None = Query(None, description="Filter by category"),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_session),
):
    service = TrendService(db)
    items = service.get_top(category, limit)
    return [TrendResponse.model_validate(t) for t in items]


@router.get("/categories", response_model=list[str])
def list_categories(db: Session = Depends(get_session)):
    service = TrendService(db)
    return service.get_categories()


@router.get("/{trend_id}", response_model=TrendResponse)
def get_trend(trend_id: int, db: Session = Depends(get_session)):
    service = TrendService(db)
    trend = service.get_by_id(trend_id)
    if not trend:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Trend not found")
    return TrendResponse.model_validate(trend)
