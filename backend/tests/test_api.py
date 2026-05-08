import pytest
from fastapi.testclient import TestClient

from app.models.trend import Trend
from app.models.game import Game
from app.models.music import Music
from app.models.movie import Movie
from app.models.analytics import Analytics


def test_health(client: TestClient):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_root(client: TestClient):
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert "message" in data
    assert "docs" in data


def test_trends_empty(client: TestClient):
    resp = client.get("/trends")
    assert resp.status_code == 200
    data = resp.json()
    assert data["items"] == []
    assert data["total"] == 0


def test_trends_with_data(client: TestClient, db_session):
    db_session.add(Trend(title="Test Trend", category="music", source="spotify", score=90.0))
    db_session.commit()

    resp = client.get("/trends")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "Test Trend"


def test_trends_top(client: TestClient, db_session):
    db_session.add(Trend(title="High", category="game", source="steam", score=95.0))
    db_session.add(Trend(title="Low", category="game", source="steam", score=50.0))
    db_session.commit()

    resp = client.get("/trends/top")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    assert data[0]["title"] == "High"


def test_trends_categories(client: TestClient, db_session):
    db_session.add(Trend(title="A", category="music", source="s", score=1))
    db_session.add(Trend(title="B", category="game", source="s", score=1))
    db_session.commit()

    resp = client.get("/trends/categories")
    assert resp.status_code == 200
    assert "music" in resp.json()
    assert "game" in resp.json()


def test_games_empty(client: TestClient):
    resp = client.get("/games")
    assert resp.status_code == 200
    assert resp.json()["items"] == []


def test_games_with_data(client: TestClient, db_session):
    db_session.add(Game(title="Test Game", genre="Action", steam_players=1000))
    db_session.commit()

    resp = client.get("/games")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1


def test_music_with_data(client: TestClient, db_session):
    db_session.add(Music(track_name="Song", artist_name="Artist", popularity=90))
    db_session.commit()

    resp = client.get("/music/top")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) > 0


def test_movies_with_data(client: TestClient, db_session):
    db_session.add(Movie(title="Film", media_type="movie", popularity=500))
    db_session.commit()

    resp = client.get("/movies")
    assert resp.status_code == 200
    assert resp.json()["total"] == 1


def test_movies_trending(client: TestClient, db_session):
    db_session.add(Movie(title="Popular", media_type="movie", popularity=999))
    db_session.commit()

    resp = client.get("/movies/trending")
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_analytics_hype(client: TestClient, db_session):
    t = Trend(title="Hype", category="music", source="spotify", score=80)
    db_session.add(t)
    db_session.commit()
    db_session.add(Analytics(trend_id=t.id, hype_score=80, growth_rate=10, sentiment_score=0.5))
    db_session.commit()

    resp = client.get("/analytics/hype-score")
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_analytics_growth(client: TestClient, db_session):
    t = Trend(title="Growing", category="music", source="spotify", score=70)
    db_session.add(t)
    db_session.commit()
    db_session.add(Analytics(trend_id=t.id, hype_score=70, growth_rate=25, sentiment_score=0.5))
    db_session.commit()

    resp = client.get("/analytics/growth")
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_analytics_history(client: TestClient, db_session):
    t = Trend(title="History", category="game", source="steam", score=85)
    db_session.add(t)
    db_session.commit()
    for i in range(3):
        db_session.add(Analytics(trend_id=t.id, hype_score=80 + i, growth_rate=5, sentiment_score=0.5))
    db_session.commit()

    resp = client.get(f"/analytics/history/{t.id}")
    assert resp.status_code == 200
    assert len(resp.json()) == 3


def test_trend_404(client: TestClient):
    resp = client.get("/trends/99999")
    assert resp.status_code == 404


def test_game_404(client: TestClient):
    resp = client.get("/games/99999")
    assert resp.status_code == 404


def test_cors_headers(client: TestClient):
    resp = client.get("/health", headers={"Origin": "http://localhost:3000"})
    assert resp.status_code == 200
    assert resp.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_pagination(client: TestClient, db_session):
    for i in range(10):
        db_session.add(Trend(title=f"Trend {i}", category="music", source="spotify", score=i))
    db_session.commit()

    resp = client.get("/trends?page=1&limit=5")
    assert resp.status_code == 200
    data = resp.json()
    assert data["page"] == 1
    assert data["limit"] == 5
    assert len(data["items"]) == 5


def test_filter_by_category(client: TestClient, db_session):
    db_session.add(Trend(title="Game", category="game", source="steam", score=80))
    db_session.add(Trend(title="Song", category="music", source="spotify", score=90))
    db_session.commit()

    resp = client.get("/trends?category=music")
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "Song"


def test_filter_by_source(client: TestClient, db_session):
    db_session.add(Trend(title="From Steam", category="game", source="steam", score=80))
    db_session.add(Trend(title="From Spotify", category="music", source="spotify", score=90))
    db_session.commit()

    resp = client.get("/trends?source=spotify")
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["source"] == "spotify"
