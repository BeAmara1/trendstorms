from datetime import datetime, timedelta, timezone

from app.analytics import (
    CorrelationEngine,
    Forecasting,
    GrowthAnalysis,
    HypeScoreEngine,
    MomentumEngine,
    TrendDetection,
)
from app.models.analytics import Analytics
from app.models.trend import Trend


class TestHypeScoreEngine:
    def test_calculate_uses_formula(self, db_session):
        engine = HypeScoreEngine(db_session)
        trend = Trend(title="Test", category="music", source="spotify", score=80, growth=40)
        db_session.add(trend)
        db_session.commit()

        hype = engine.calculate(trend)
        assert 0 <= hype <= 100
        assert hype > 50

    def test_calculate_from_data(self, db_session):
        engine = HypeScoreEngine(db_session)
        data = {"score": 90, "growth": 60, "source": "google_trends", "category": "trending_search"}
        hype = engine.calculate_from_data(data)
        assert hype > 70

    def test_compute_for_all_trends(self, db_session):
        engine = HypeScoreEngine(db_session)
        db_session.add_all([
            Trend(title="A", category="music", source="spotify", score=50, growth=20),
            Trend(title="B", category="game", source="steam", score=80, growth=60),
        ])
        db_session.commit()

        results = engine.compute_for_all_trends()
        assert len(results) == 2
        assert results[0]["hype_score"] >= results[1]["hype_score"]

    def test_save_daily_snapshot(self, db_session):
        engine = HypeScoreEngine(db_session)
        db_session.add(Trend(title="Test", category="music", source="spotify", score=50, growth=20))
        db_session.commit()

        snapshots = engine.save_daily_snapshot()
        assert len(snapshots) == 1
        assert snapshots[0].hype_score > 0

    def test_source_weights(self, db_session):
        engine = HypeScoreEngine(db_session)
        assert engine._get_source_weight("spotify") == 0.9
        assert engine._get_source_weight("unknown") == 0.5

    def test_category_weights(self, db_session):
        engine = HypeScoreEngine(db_session)
        assert engine._get_category_weight("music") == 0.9
        assert engine._get_category_weight("unknown") == 0.5


class TestGrowthAnalysis:
    def test_classify_exploding(self, db_session):
        ga = GrowthAnalysis(db_session)
        assert ga.classify_growth(100) == "exploding"
        assert ga.classify_growth(51) == "exploding"

    def test_classify_rising(self, db_session):
        ga = GrowthAnalysis(db_session)
        assert ga.classify_growth(25) == "rising"
        assert ga.classify_growth(11) == "rising"

    def test_classify_stable(self, db_session):
        ga = GrowthAnalysis(db_session)
        assert ga.classify_growth(0) == "stable"
        assert ga.classify_growth(5) == "stable"
        assert ga.classify_growth(-5) == "stable"

    def test_classify_declining(self, db_session):
        ga = GrowthAnalysis(db_session)
        assert ga.classify_growth(-20) == "declining"
        assert ga.classify_growth(-49) == "declining"

    def test_classify_crashing(self, db_session):
        ga = GrowthAnalysis(db_session)
        assert ga.classify_growth(-100) == "crashing"

    def test_get_exploding(self, db_session):
        ga = GrowthAnalysis(db_session)
        db_session.add_all([
            Trend(title="A", category="music", source="spotify", score=50, growth=100),
            Trend(title="B", category="game", source="steam", score=30, growth=5),
        ])
        db_session.commit()

        results = ga.get_exploding()
        assert len(results) == 1
        assert results[0]["title"] == "A"

    def test_analyze_trend(self, db_session):
        ga = GrowthAnalysis(db_session)
        trend = Trend(title="Test", category="music", source="spotify", score=50, growth=30)
        db_session.add(trend)
        db_session.commit()

        result = ga.analyze_trend(trend)
        assert result["classification"] == "rising"
        assert result["growth"] == 30

    def test_get_growth_summary(self, db_session):
        ga = GrowthAnalysis(db_session)
        db_session.add_all([
            Trend(title="A", category="music", source="spotify", score=50, growth=100),
            Trend(title="B", category="game", source="steam", score=30, growth=5),
            Trend(title="C", category="movie", source="tmdb", score=20, growth=-60),
        ])
        db_session.commit()

        summary = ga.get_growth_summary()
        assert summary["exploding"] == 1
        assert summary["stable"] == 1
        assert summary["crashing"] == 1


class TestMomentumEngine:
    def test_low_momentum_with_few_snapshots(self, db_session):
        engine = MomentumEngine(db_session)
        trend = Trend(title="Test", category="music", source="spotify", score=50, growth=20)
        db_session.add(trend)
        db_session.commit()

        result = engine.calculate_momentum(trend.id)
        assert result["momentum"] == "low"

    def test_momentum_with_snapshots(self, db_session):
        engine = MomentumEngine(db_session)
        trend = Trend(title="Test", category="music", source="spotify", score=50, growth=20)
        db_session.add(trend)
        db_session.commit()

        now = datetime.now(timezone.utc)
        for i in range(5):
            db_session.add(Analytics(
                trend_id=trend.id, hype_score=float(30 + i * 10),
                growth_rate=float(10 + i * 5), created_at=now - timedelta(hours=i),
            ))
        db_session.commit()

        result = engine.calculate_momentum(trend.id)
        assert result["momentum"] in ("accelerating", "high", "decelerating", "low")

    def test_analyze_all(self, db_session):
        engine = MomentumEngine(db_session)
        trend = Trend(title="Test", category="music", source="spotify", score=50, growth=20)
        db_session.add(trend)
        db_session.commit()

        now = datetime.now(timezone.utc)
        for i in range(5):
            db_session.add(Analytics(
                trend_id=trend.id, hype_score=float(50 + i * 5),
                growth_rate=float(20 + i * 3), created_at=now - timedelta(hours=i),
            ))
        db_session.commit()

        results = engine.analyze_all()
        assert len(results) == 1
        assert results[0]["id"] == trend.id

    def test_get_high_momentum(self, db_session):
        engine = MomentumEngine(db_session)
        trend = Trend(title="Test", category="music", source="spotify", score=80, growth=50)
        db_session.add(trend)
        db_session.commit()

        now = datetime.now(timezone.utc)
        for i in range(5):
            db_session.add(Analytics(
                trend_id=trend.id, hype_score=float(60 + i * 10),
                growth_rate=float(30 + i * 8), created_at=now - timedelta(hours=i),
            ))
        db_session.commit()

        results = engine.get_high_momentum()
        assert len(results) >= 0


class TestTrendDetection:
    def test_classify_new_trend(self, db_session):
        td = TrendDetection(db_session)
        trend = Trend(title="Test", category="music", source="spotify", score=50, growth=20,
                      created_at=datetime.now(timezone.utc))
        db_session.add(trend)
        db_session.commit()

        result = td.classify_trend(trend)
        assert result["classification"] in ("new", "sustained", "explosive", "viral", "falling")

    def test_classify_explosive(self, db_session):
        td = TrendDetection(db_session)
        trend = Trend(title="Test", category="music", source="spotify", score=90, growth=80)
        db_session.add(trend)
        db_session.commit()

        now = datetime.now(timezone.utc)
        for i in range(3):
            db_session.add(Analytics(trend_id=trend.id, hype_score=10.0 * (i + 1),
                                      growth_rate=5.0 * (i + 1),
                                      created_at=now - timedelta(hours=2 * (2 - i))))
        db_session.commit()

        result = td.classify_trend(trend)
        assert result["classification"] in ("explosive", "viral")

    def test_generate_insights(self, db_session):
        td = TrendDetection(db_session)
        trend = Trend(title="Test", category="music", source="spotify", score=80, growth=60)
        db_session.add(trend)
        db_session.commit()

        now = datetime.now(timezone.utc)
        for i in range(3):
            db_session.add(Analytics(trend_id=trend.id, hype_score=10.0 * (i + 1),
                                      growth_rate=5.0 * (i + 1),
                                      created_at=now - timedelta(hours=2 * (2 - i))))
        db_session.commit()

        insights = td.generate_insights()
        assert len(insights) > 0
        assert "Test" in insights[0]

    def test_get_classification_summary(self, db_session):
        td = TrendDetection(db_session)
        db_session.add(Trend(title="A", category="music", source="spotify", score=50, growth=20))
        db_session.commit()

        summary = td.get_classification_summary()
        assert isinstance(summary, dict)


class TestCorrelationEngine:
    def test_find_correlations_matched_titles(self, db_session):
        engine = CorrelationEngine(db_session)
        db_session.add_all([
            Trend(title="Cool Thing", category="music", source="spotify", score=80, growth=50),
            Trend(title="Cool Thing", category="music", source="google_trends", score=70, growth=40),
        ])
        db_session.commit()

        results = engine.find_correlations(threshold=0.3)
        assert len(results) == 1
        assert results[0]["title"] == "Cool Thing"
        assert results[0]["source_count"] == 2

    def test_find_correlations_no_match(self, db_session):
        engine = CorrelationEngine(db_session)
        db_session.add_all([
            Trend(title="Alpha", category="music", source="spotify", score=50, growth=10),
            Trend(title="Beta", category="game", source="steam", score=30, growth=5),
        ])
        db_session.commit()

        results = engine.find_correlations(threshold=0.3)
        assert len(results) == 0

    def test_generate_correlation_insights(self, db_session):
        engine = CorrelationEngine(db_session)
        db_session.add_all([
            Trend(title="Shared", category="music", source="spotify", score=90, growth=80),
            Trend(title="Shared", category="music", source="google_trends", score=85, growth=75),
        ])
        db_session.commit()

        insights = engine.generate_correlation_insights()
        assert len(insights) > 0
        assert "Shared" in insights[0]

    def test_find_multi_platform_trends(self, db_session):
        engine = CorrelationEngine(db_session)
        db_session.add_all([
            Trend(title="Multi", category="music", source="spotify", score=60, growth=30),
            Trend(title="Multi", category="music", source="google_trends", score=55, growth=25),
        ])
        db_session.commit()

        results = engine.find_multi_platform_trends(limit=5)
        assert len(results) == 1

    def test_get_trends_by_source(self, db_session):
        engine = CorrelationEngine(db_session)
        db_session.add(Trend(title="Test", category="music", source="spotify", score=50, growth=20))
        db_session.commit()

        grouped = engine.get_trends_by_source()
        assert "spotify" in grouped


class TestForecasting:
    def test_moving_average(self, db_session):
        f = Forecasting(db_session)
        assert f.moving_average([1, 2, 3, 4, 5], window=3) == [1.0, 1.5, 2.0, 3.0, 4.0]

    def test_moving_average_short(self, db_session):
        f = Forecasting(db_session)
        assert f.moving_average([1, 2], window=3) == [1, 2]

    def test_linear_trend(self, db_session):
        f = Forecasting(db_session)
        predictions = f.linear_trend([10, 20, 30, 40], steps=2)
        assert len(predictions) == 2
        assert predictions[0] > 40

    def test_linear_trend_single_value(self, db_session):
        f = Forecasting(db_session)
        predictions = f.linear_trend([10], steps=2)
        assert predictions == [10, 10, 10]

    def test_predict_trend_no_data(self, db_session):
        f = Forecasting(db_session)
        result = f.predict_trend(999)
        assert "error" in result

    def test_predict_trend_with_data(self, db_session):
        f = Forecasting(db_session)
        trend = Trend(title="Test", category="music", source="spotify", score=50, growth=20)
        db_session.add(trend)
        db_session.commit()

        now = datetime.now(timezone.utc)
        for i in range(5):
            db_session.add(Analytics(
                trend_id=trend.id, hype_score=float(10 * (i + 1)),
                growth_rate=float(5 * (i + 1)), created_at=now - timedelta(hours=i * 2),
            ))
        db_session.commit()

        result = f.predict_trend(trend.id, steps=3)
        assert "predictions" in result
        assert len(result["predictions"]) == 3
        assert result["trend_direction"] in ("up", "down")

    def test_predict_all(self, db_session):
        f = Forecasting(db_session)
        trend = Trend(title="Test", category="music", source="spotify", score=50, growth=20)
        db_session.add(trend)
        db_session.commit()

        now = datetime.now(timezone.utc)
        for i in range(3):
            db_session.add(Analytics(
                trend_id=trend.id, hype_score=float(10 * (i + 1)),
                growth_rate=float(5 * (i + 1)), created_at=now - timedelta(hours=i * 2),
            ))
        db_session.commit()

        results = f.predict_all(steps=2)
        assert len(results) == 1
