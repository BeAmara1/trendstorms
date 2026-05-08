from sqlalchemy.orm import Session

from app.models.game import Game
from app.repositories.games_repository import GamesRepository


class GameService:
    def __init__(self, db: Session):
        self.repo = GamesRepository(db)

    def get_all(self, genre: str | None = None, sort: str = "players", page: int = 1, limit: int = 20) -> tuple[list[Game], int]:
        query = self.repo.db.query(Game)

        if genre:
            query = query.filter(Game.genre == genre)

        total = query.count()

        sort_map = {
            "players": Game.steam_players.desc(),
            "rating": Game.rating.desc(),
            "newest": Game.created_at.desc(),
        }
        order = sort_map.get(sort, Game.steam_players.desc())
        query = query.order_by(order)

        offset = (page - 1) * limit
        items = query.offset(offset).limit(limit).all()

        return items, total

    def get_by_id(self, game_id: int) -> Game | None:
        return self.repo.db.query(Game).filter(Game.id == game_id).first()

    def get_top(self, limit: int = 20) -> list[Game]:
        return self.repo.db.query(Game).order_by(Game.steam_players.desc()).limit(limit).all()

    def get_genres(self) -> list[str]:
        results = self.repo.db.query(Game.genre).distinct().all()
        return [r[0] for r in results if r[0]]
