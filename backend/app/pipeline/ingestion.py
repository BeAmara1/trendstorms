from sqlalchemy.orm import Session

from app.collectors import (
    SpotifyCollector,
    SteamCollector,
    RAWGCollector,
    TMDBCollector,
    TrendsCollector,
)
from app.repositories import TrendsRepository, GamesRepository, MusicRepository, MoviesRepository
from app.services.logger import get_logger
from app.services.snapshot_service import SnapshotService

logger = get_logger("pipeline")


def run_spotify_pipeline(db: Session) -> list[dict]:
    collector = SpotifyCollector()
    repo = TrendsRepository(db)
    music_repo = MusicRepository(db)
    snapshot = SnapshotService(db)
    results = []

    tracks = collector.collect()
    for item in tracks:
        trend = repo.save_trend(item)
        music_repo.save_music({
            "track_name": item["title"],
            "artist_name": item.get("extra", {}).get("artist", "Unknown"),
            "popularity": int(item["score"]),
            "spotify_id": item.get("extra", {}).get("url", ""),
            "image_url": item.get("extra", {}).get("image"),
        })
        snapshot.create_snapshot(trend)
        results.append(item)

    logger.info("Spotify pipeline: %d tracks saved", len(tracks))
    return results


def run_steam_pipeline(db: Session) -> list[dict]:
    collector = SteamCollector()
    repo = TrendsRepository(db)
    games_repo = GamesRepository(db)
    snapshot = SnapshotService(db)
    results = []

    games = collector.collect()
    for item in games:
        trend = repo.save_trend(item)
        games_repo.save_game({
            "title": item["title"],
            "steam_players": int(item["score"]),
            "source_id": str(item.get("extra", {}).get("app_id", "")),
        })
        snapshot.create_snapshot(trend)
        results.append(item)

    logger.info("Steam pipeline: %d games saved", len(games))
    return results


def run_rawg_pipeline(db: Session) -> list[dict]:
    collector = RAWGCollector()
    repo = TrendsRepository(db)
    games_repo = GamesRepository(db)
    snapshot = SnapshotService(db)
    results = []

    games = collector.collect()
    for item in games:
        trend = repo.save_trend(item)
        extra = item.get("extra", {})
        games_repo.save_game({
            "title": item["title"],
            "genre": (extra.get("genres") or ["Unknown"])[0],
            "rating": extra.get("rating", 0),
            "release_date": extra.get("released"),
            "image_url": extra.get("image"),
        })
        snapshot.create_snapshot(trend)
        results.append(item)

    logger.info("RAWG pipeline: %d games saved", len(games))
    return results


def run_tmdb_pipeline(db: Session) -> list[dict]:
    collector = TMDBCollector()
    repo = TrendsRepository(db)
    movies_repo = MoviesRepository(db)
    snapshot = SnapshotService(db)
    results = []

    items = collector.collect()
    for item in items:
        trend = repo.save_trend(item)
        extra = item.get("extra", {})
        movies_repo.save_movie({
            "title": item["title"],
            "media_type": item["category"],
            "rating": item["score"] / 10,
            "popularity": item["growth"],
            "release_date": extra.get("release_date") or extra.get("first_air_date"),
            "poster_url": extra.get("image"),
        })
        snapshot.create_snapshot(trend)
        results.append(item)

    logger.info("TMDB pipeline: %d items saved", len(items))
    return results


def run_trends_pipeline(db: Session) -> list[dict]:
    collector = TrendsCollector()
    repo = TrendsRepository(db)
    snapshot = SnapshotService(db)
    results = []

    items = collector.collect()
    for item in items:
        trend = repo.save_trend(item)
        snapshot.create_snapshot(trend)
        results.append(item)

    logger.info("Trends pipeline: %d items saved", len(items))
    return results


def run_all_pipelines(db: Session) -> dict[str, int]:
    results = {}
    pipelines = [
        ("spotify", run_spotify_pipeline),
        ("steam", run_steam_pipeline),
        ("rawg", run_rawg_pipeline),
        ("tmdb", run_tmdb_pipeline),
        ("trends", run_trends_pipeline),
    ]
    for name, pipeline in pipelines:
        try:
            data = pipeline(db)
            results[name] = len(data)
        except Exception as e:
            logger.error("Pipeline %s failed: %s", name, str(e))
            results[name] = 0

    logger.info("All pipelines complete: %s", results)
    return results
