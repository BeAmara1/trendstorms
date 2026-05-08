import logging
import os
from logging.handlers import RotatingFileHandler

LOG_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "logs")
os.makedirs(LOG_DIR, exist_ok=True)

_LOG_FORMAT = "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
_FORMATTER = logging.Formatter(_LOG_FORMAT)

_CONSOLE_HANDLER = logging.StreamHandler()
_CONSOLE_HANDLER.setFormatter(_FORMATTER)

_root_logger = logging.getLogger()
_root_logger.setLevel(logging.INFO)
_root_logger.addHandler(_CONSOLE_HANDLER)

_LOGGER_CACHE: dict[str, logging.Logger] = {}


def get_logger(name: str) -> logging.Logger:
    if name not in _LOGGER_CACHE:
        logger = logging.getLogger(name)

        log_file = os.path.join(LOG_DIR, f"{name}.log")
        file_handler = RotatingFileHandler(log_file, maxBytes=5 * 1024 * 1024, backupCount=3)
        file_handler.setFormatter(_FORMATTER)
        logger.addHandler(file_handler)

        _LOGGER_CACHE[name] = logger
    return _LOGGER_CACHE[name]
