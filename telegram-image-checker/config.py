"""Configuration loading and validation.

All runtime settings come from environment variables (see ``.env.example``).
``load_config()`` returns a validated :class:`Config`; it raises a clear error
if a required value is missing so failures happen at startup, not mid-run.
"""

from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


class ConfigError(RuntimeError):
    """Raised when required configuration is missing or invalid."""


def _require(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise ConfigError(
            f"Missing required environment variable {name!r}. "
            "Copy .env.example to .env and fill it in."
        )
    return value


def _int(name: str, default: int) -> int:
    raw = os.getenv(name, "").strip()
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError as exc:  # pragma: no cover - defensive
        raise ConfigError(f"{name} must be an integer, got {raw!r}") from exc


@dataclass(frozen=True)
class Config:
    api_id: int
    api_hash: str
    phone: str
    bot_token: str
    target_channel: str
    phash_threshold: int
    max_results: int
    db_path: str
    admin_user_id: int | None

    @property
    def channel(self) -> str | int:
        """Return the channel as an int id when numeric, else the raw string."""
        raw = self.target_channel
        try:
            return int(raw)
        except ValueError:
            return raw


def load_config() -> Config:
    api_id_raw = _require("API_ID")
    try:
        api_id = int(api_id_raw)
    except ValueError as exc:
        raise ConfigError(f"API_ID must be an integer, got {api_id_raw!r}") from exc

    admin_raw = os.getenv("ADMIN_USER_ID", "").strip()
    admin_user_id = int(admin_raw) if admin_raw else None

    return Config(
        api_id=api_id,
        api_hash=_require("API_HASH"),
        phone=_require("PHONE"),
        bot_token=_require("BOT_TOKEN"),
        target_channel=_require("TARGET_CHANNEL"),
        phash_threshold=_int("PHASH_THRESHOLD", 8),
        max_results=_int("MAX_RESULTS", 5),
        db_path=os.getenv("DB_PATH", "index.db").strip() or "index.db",
        admin_user_id=admin_user_id,
    )
