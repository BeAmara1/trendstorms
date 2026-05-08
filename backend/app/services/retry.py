import time
from functools import wraps
from typing import Callable, TypeVar

from app.services.logger import get_logger

logger = get_logger("retry")

F = TypeVar("F", bound=Callable)


def with_retry(
    max_retries: int = 3,
    delay: float = 2.0,
    backoff: float = 2.0,
    exceptions: tuple = (Exception,),
):
    def decorator(func: F) -> F:
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exc = None
            wait = delay
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exc = e
                    logger.warning(
                        "%s attempt %d/%d failed: %s. Retrying in %.1fs...",
                        func.__name__, attempt + 1, max_retries, e, wait,
                    )
                    time.sleep(wait)
                    wait *= backoff
            logger.error("%s failed after %d retries: %s", func.__name__, max_retries, last_exc)
            raise last_exc
        return wrapper
    return decorator


class RateLimiter:
    def __init__(self, min_interval: float = 1.0):
        self.min_interval = min_interval
        self._last_call: float = 0.0

    def wait(self):
        now = time.time()
        elapsed = now - self._last_call
        if elapsed < self.min_interval:
            time.sleep(self.min_interval - elapsed)
        self._last_call = time.time()
