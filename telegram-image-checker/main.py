"""Entry point.

Usage:
    python main.py backfill   # one-off: index the channel's entire photo history
    python main.py run        # run the bot + keep indexing new posts live

Both commands share one user-account session file (``user.session``) and one
bot login. The first ``backfill`` run prompts for the phone login code.
"""

from __future__ import annotations

import asyncio
import sys

from telethon import TelegramClient

from bot import register_handlers
from config import Config, load_config
from db import PhotoIndex
from indexer import backfill, register_live_indexer

USAGE = "Usage: python main.py [backfill|run]"


def _make_user_client(config: Config) -> TelegramClient:
    return TelegramClient("user", config.api_id, config.api_hash)


async def cmd_backfill(config: Config) -> None:
    index = PhotoIndex(config.db_path)
    user = _make_user_client(config)
    await user.start(phone=config.phone)
    try:
        entity = await user.get_entity(config.channel)
        print(f"Indexing history of: {getattr(entity, 'title', config.channel)}")
        await backfill(user, index, config.channel)
    finally:
        await user.disconnect()
        index.close()


async def cmd_run(config: Config) -> None:
    index = PhotoIndex(config.db_path)
    user = _make_user_client(config)
    bot = TelegramClient("bot", config.api_id, config.api_hash)

    await user.start(phone=config.phone)
    await bot.start(bot_token=config.bot_token)

    # Keep the index fresh: index new posts as they arrive.
    register_live_indexer(user, index, config.channel)

    async def reindex_coro() -> int:
        return await backfill(user, index, config.channel)

    register_handlers(bot, index, config, reindex_coro)

    me = await bot.get_me()
    print(f"Bot @{me.username} is running. Indexed {index.count()} photos.")
    print("Send the bot a photo in a private chat to check it. Ctrl+C to stop.")

    try:
        await asyncio.gather(
            user.run_until_disconnected(),
            bot.run_until_disconnected(),
        )
    finally:
        index.close()


def main() -> None:
    if len(sys.argv) != 2 or sys.argv[1] not in {"backfill", "run"}:
        print(USAGE)
        raise SystemExit(2)

    config = load_config()
    command = sys.argv[1]
    if command == "backfill":
        asyncio.run(cmd_backfill(config))
    else:
        asyncio.run(cmd_run(config))


if __name__ == "__main__":
    main()
