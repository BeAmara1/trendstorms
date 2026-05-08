from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Any

from app.services.logger import get_logger


class BaseCollector(ABC):
    def __init__(self, name: str):
        self.name = name
        self.logger = get_logger(name)

    @abstractmethod
    def fetch_data(self) -> list[dict[str, Any]]:
        pass

    def normalize(
        self,
        title: str,
        category: str,
        source: str,
        score: float,
        growth: float = 0.0,
        extra: dict | None = None,
    ) -> dict[str, Any]:
        return {
            "title": title,
            "category": category,
            "source": source,
            "score": round(score, 2),
            "growth": round(growth, 2),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            **(extra or {}),
        }

    def collect(self) -> list[dict[str, Any]]:
        self.logger.info("Starting data collection for %s", self.name)
        try:
            data = self.fetch_data()
            self.logger.info("Collected %d items from %s", len(data), self.name)
            return data
        except Exception as e:
            self.logger.error("Failed to collect data from %s: %s", self.name, str(e))
            return []
