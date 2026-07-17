"""The user-facing bot: send it a photo, it tells you if the channel has it.

Runs as a Telethon bot client. Handlers cover /start, /stats, /reindex (admin),
and the core photo handler that hashes the incoming image and queries the index.
"""

from __future__ import annotations

from PIL import UnidentifiedImageError
from telethon import TelegramClient, events

from config import Config
from db import Match, PhotoIndex
from hashing import hash_image

HELP_TEXT = (
    "👋 Send me a photo and I'll check whether the same or a similar image "
    "already exists in the channel I watch.\n\n"
    "Commands:\n"
    "• /stats — how many photos are indexed\n"
    "• /reindex — (admin) scan the channel history again"
)


def register_handlers(
    bot: TelegramClient,
    index: PhotoIndex,
    config: Config,
    reindex_coro,
) -> None:
    """Attach all bot handlers. ``reindex_coro`` is an async callable that runs
    a backfill pass; it is invoked by the /reindex admin command."""

    @bot.on(events.NewMessage(pattern=r"^/start", func=lambda e: e.is_private))
    async def _start(event):
        await event.reply(HELP_TEXT)

    @bot.on(events.NewMessage(pattern=r"^/stats", func=lambda e: e.is_private))
    async def _stats(event):
        await event.reply(f"📇 {index.count()} photos indexed.")

    @bot.on(events.NewMessage(pattern=r"^/reindex", func=lambda e: e.is_private))
    async def _reindex(event):
        if config.admin_user_id and event.sender_id != config.admin_user_id:
            await event.reply("⛔ Only the admin can trigger a reindex.")
            return
        await event.reply("🔄 Re-scanning channel history… this may take a while.")
        added = await reindex_coro()
        await event.reply(f"✅ Done. {added} new photos added ({index.count()} total).")

    @bot.on(events.NewMessage(func=lambda e: e.is_private and e.photo is not None))
    async def _photo(event):
        data = await event.download_media(file=bytes)
        if not data:
            await event.reply("⚠️ Couldn't download that image, try again.")
            return
        try:
            sha256, phash = hash_image(data)
        except (UnidentifiedImageError, OSError):
            await event.reply("⚠️ That doesn't look like a readable image.")
            return

        matches = index.find_matches(
            sha256=sha256,
            phash=phash,
            threshold=config.phash_threshold,
            limit=config.max_results,
        )
        await event.reply(_format_reply(matches), link_preview=False)


def _format_reply(matches: list[Match]) -> str:
    if not matches:
        return "✅ No matching or similar image found in the channel."

    exact = [m for m in matches if m.exact]
    lines: list[str] = []
    if exact:
        lines.append("🚨 *Exact duplicate* already in the channel:")
    else:
        lines.append("⚠️ *Similar image(s)* already in the channel:")

    for m in matches:
        tag = "exact match" if m.exact else f"similarity distance {m.distance}"
        when = f" — {m.date[:10]}" if m.date else ""
        link = m.link or f"message {m.message_id}"
        lines.append(f"• {link} ({tag}){when}")

    return "\n".join(lines)
