from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_session
from app.schemas.music_schema import MusicResponse, MusicList
from app.services.music_service import MusicService

router = APIRouter(prefix="/music", tags=["Music"])


@router.get("", response_model=MusicList)
def list_music(
    genre: str | None = Query(None, description="Filter by genre"),
    sort: str = Query("popularity", description="Sort field: popularity, newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_session),
):
    service = MusicService(db)
    items, total = service.get_all(genre, sort, page, limit)
    return MusicList(
        items=[MusicResponse.model_validate(m) for m in items],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/top", response_model=list[MusicResponse])
def top_music(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_session),
):
    service = MusicService(db)
    items = service.get_top(limit)
    return [MusicResponse.model_validate(m) for m in items]


@router.get("/artists", response_model=list[MusicResponse])
def top_artists(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_session),
):
    service = MusicService(db)
    items = service.get_artists(limit)
    return [MusicResponse.model_validate(m) for m in items]


@router.get("/genres", response_model=list[str])
def list_genres(db: Session = Depends(get_session)):
    service = MusicService(db)
    return service.get_genres()


@router.get("/{music_id}", response_model=MusicResponse)
def get_music(music_id: int, db: Session = Depends(get_session)):
    from app.models.music import Music
    item = db.query(Music).filter(Music.id == music_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Music not found")
    return MusicResponse.model_validate(item)
