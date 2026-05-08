import time
from collections import OrderedDict
from typing import Any, Optional


class MemoryCache:
    def __init__(self, ttl: int = 300, maxsize: int = 128):
        self._store: OrderedDict[str, tuple[float, Any]] = OrderedDict()
        self._ttl = ttl
        self._maxsize = maxsize

    def get(self, key: str) -> Optional[Any]:
        if key not in self._store:
            return None
        expires, value = self._store[key]
        if time.time() > expires:
            del self._store[key]
            return None
        self._store.move_to_end(key)
        return value

    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        expires = time.time() + (ttl if ttl is not None else self._ttl)
        self._store[key] = (expires, value)
        self._store.move_to_end(key)
        if len(self._store) > self._maxsize:
            self._store.popitem(last=False)

    def invalidate(self, key: str):
        self._store.pop(key, None)

    def clear(self):
        self._store.clear()

    @property
    def size(self) -> int:
        return len(self._store)


cache = MemoryCache(ttl=300, maxsize=128)
