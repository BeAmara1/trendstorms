from sqlalchemy.orm import Session

from app.models.game import Game


class GamesRepository:
    def __init__(self, db: Session):
        self.db = db

    def save_game(self, data: dict) -> Game:
        game = Game(
            title=data["title"],
            genre=data.get("genre"),
            steam_players=data.get("steam_players", 0),
            rating=data.get("rating", 0),
            release_date=data.get("release_date"),
            image_url=data.get("image_url"),
            source_id=str(data.get("source_id", "")),
        )
        existing = self.get_by_source_id(str(data.get("source_id", "")))
        if existing:
            existing.steam_players = data.get("steam_players", existing.steam_players)
            existing.rating = data.get("rating", existing.rating)
            self.db.commit()
            self.db.refresh(existing)
            return existing
        self.db.add(game)
        self.db.commit()
        self.db.refresh(game)
        return game

    def get_top_games(self, limit: int = 20) -> list[Game]:
        return (
            self.db.query(Game)
            .order_by(Game.steam_players.desc())
            .limit(limit)
            .all()
        )

    def get_by_source_id(self, source_id: str) -> Game | None:
        return (
            self.db.query(Game)
            .filter(Game.source_id == source_id)
            .first()
        )
