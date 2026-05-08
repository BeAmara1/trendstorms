from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_session
from app.schemas.game_schema import GameResponse, GameList
from app.services.game_service import GameService

router = APIRouter(prefix="/games", tags=["Games"])


@router.get("", response_model=GameList)
def list_games(
    genre: str | None = Query(None, description="Filter by genre"),
    sort: str = Query("players", description="Sort field: players, rating, newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_session),
):
    service = GameService(db)
    items, total = service.get_all(genre, sort, page, limit)
    return GameList(
        items=[GameResponse.model_validate(g) for g in items],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/top", response_model=list[GameResponse])
def top_games(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_session),
):
    service = GameService(db)
    items = service.get_top(limit)
    return [GameResponse.model_validate(g) for g in items]


@router.get("/genres", response_model=list[str])
def list_genres(db: Session = Depends(get_session)):
    service = GameService(db)
    return service.get_genres()


@router.get("/{game_id}", response_model=GameResponse)
def get_game(game_id: int, db: Session = Depends(get_session)):
    service = GameService(db)
    game = service.get_by_id(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return GameResponse.model_validate(game)
