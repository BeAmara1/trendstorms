from datetime import datetime, timezone

import pandas as pd
from pytrends.request import TrendReq

from app.collectors.base_collector import BaseCollector


class TrendsCollector(BaseCollector):
    def __init__(self):
        super().__init__("google_trends")
        self.client = TrendReq(hl="en-US", tz=0)

    def get_trending_searches(self, limit: int = 20) -> list[dict]:
        try:
            trending = self.client.trending_searches(pn="united_states")
        except Exception as e:
            self.logger.error("Trends API error (trending): %s", str(e))
            return []

        results = []
        for i, row in trending.head(limit).iterrows():
            term = row[0]
            results.append(
                self.normalize(
                    title=term,
                    category="trending_search",
                    source="google_trends",
                    score=100 - i,
                    growth=0,
                    extra={"rank": i + 1},
                )
            )
        return results

    def compare_keywords(self, keywords: list[str], timeframe: str = "today 3-m") -> list[dict]:
        try:
            self.client.build_payload(kw_list=keywords, timeframe=timeframe)
            data = self.client.interest_over_time()
        except Exception as e:
            self.logger.error("Trends API error (compare): %s", str(e))
            return []

        if data.empty:
            return []

        results = []
        for kw in keywords:
            if kw in data.columns:
                values = data[kw].dropna()
                if not values.empty:
                    growth = ((values.iloc[-1] - values.iloc[0]) / values.iloc[0] * 100) if values.iloc[0] > 0 else 0
                    avg_score = values.mean()
                    results.append(
                        self.normalize(
                            title=kw,
                            category="keyword_comparison",
                            source="google_trends",
                            score=float(avg_score),
                            growth=float(round(growth, 2)),
                            extra={
                                "timeframe": timeframe,
                                "peak": float(values.max()),
                                "current": float(values.iloc[-1]),
                            },
                        )
                    )
        return results

    def fetch_data(self) -> list[dict]:
        return self.get_trending_searches()
