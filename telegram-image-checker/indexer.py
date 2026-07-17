"""Channel indexing via a Telegram *user* account (Telethon / MTProto).

A bot cannot read a channel's history, so indexing runs on a real user account
that is a member of the channel. :func:`backfill` walks the entire photo history
once; :func:`register_live_indexer` keeps the index current for new posts.
"""

from __future__ import annotations

from PIL import UnidentifiedImageError
from telethon import TelegramClient, events
from telethon.tl.types import InputMessagesFilterPhotos

from db import PhotoIndex
from hashing import hash_image


def message_link(chat, message_id: int) -> str:
    """Build a t.me deep link to a message.

    Public channels/groups -> ``https://t.me/<username>/<id>``.
    Private ones -> ``https://t.me/c/<internal_id>/<id>`` where ``internal_id``
    is the channel id with the ``-100`` prefix stripped.
    """
    username = getattr(chat, "username", None)
    if username:
        return f"https://t.me/{username}/{message_id}"

    chat_id = getattr(chat, "id", None)
    if chat_id is None:
        return ""
    internal = str(chat_id)
    if internal.startswith("-100"):
        internal = internal[4:]
    else:
        internal = internal.lstrip("-")
    return f"https://t.me/c/{internal}/{message_id}"


async def _index_message(client: TelegramClient, index: PhotoIndex, message) -> bool:
    """Download, hash, and store one photo message. Returns True if indexed."""
    if not message.photo and not _is_image_document(message):
        return False

    data = await client.download_media(message, file=bytes)
    if not data:
        return False

    try:
        sha256, phash = hash_image(data)
    except (UnidentifiedImageError, OSError):
        # Not a decodable image (rare for photos, possible for odd documents).
        return False

    chat = await message.get_chat()
    file_unique_id = None
    if message.photo is not None:
        file_unique_id = str(getattr(message.photo, "id", "") or "")

    index.upsert(
        channel_id=chat.id,
        message_id=message.id,
        file_unique_id=file_unique_id,
        sha256=sha256,
        phash=phash,
        date=message.date.isoformat() if message.date else None,
        link=message_link(chat, message.id),
    )
    return True


def _is_image_document(message) -> bool:
    doc = getattr(message, "document", None)
    if not doc:
        return False
    mime = getattr(doc, "mime_type", "") or ""
    return mime.startswith("image/")


async def backfill(client: TelegramClient, index: PhotoIndex, channel) -> int:
    """Index every existing photo in ``channel``. Idempotent and resumable.

    Already-indexed messages are skipped, so re-running only picks up whatever
    is new since the last run.
    """
    entity = await client.get_entity(channel)
    indexed = 0
    scanned = 0

    async for message in client.iter_messages(
        entity, filter=InputMessagesFilterPhotos
    ):
        scanned += 1
        if index.has_message(entity.id, message.id):
            continue
        if await _index_message(client, index, message):
            indexed += 1
            if indexed % 50 == 0:
                print(f"  indexed {indexed} new photos ({scanned} scanned)...")

    print(f"Backfill complete: {indexed} new photos indexed ({scanned} scanned).")
    return indexed


def register_live_indexer(
    client: TelegramClient, index: PhotoIndex, channel
) -> None:
    """Attach a handler that indexes new photos as they are posted."""

    @client.on(events.NewMessage(chats=channel))
    async def _on_new(event):  # pragma: no cover - requires live Telegram
        if event.photo or _is_image_document(event.message):
            if await _index_message(client, index, event.message):
                print(f"Live-indexed new photo (message {event.id}).")
