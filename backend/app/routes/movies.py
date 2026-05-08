from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_session
from app.schemas.movie_schema import MovieResponse, MovieList
from app.services.movie_service import MovieService

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get("", response_model=MovieList)
def list_movies(
    media_type: str | None = Query(None, description="Filter by type: movie, tv"),
    sort: str = Query("popularity", description="Sort field: popularity, rating, newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_session),
):
    service = MovieService(db)
    items, total = service.get_all(media_type, sort, page, limit)
    return MovieList(
        items=[MovieResponse.model_validate(m) for m in items],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/trending", response_model=list[MovieResponse])
def trending_movies(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_session),
):
    service = MovieService(db)
    items = service.get_trending(limit)
    return [MovieResponse.model_validate(m) for m in items]


@router.get("/{movie_id}", response_model=MovieResponse)
def get_movie(movie_id: int, db: Session = Depends(get_session)):
    service = MovieService(db)
    movie = service.get_by_id(movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return MovieResponse.model_validate(movie)
