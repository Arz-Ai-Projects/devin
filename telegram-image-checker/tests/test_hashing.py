"""Local tests for the matching core — no Telegram credentials needed.

These exercise the two signals the whole feature rests on:
  * exact-duplicate detection via SHA-256, and
  * "similar image" detection via perceptual-hash Hamming distance,
plus the DB query that ranks matches under a threshold.
"""

from __future__ import annotations

import io
import os
import sys
import tempfile

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import PhotoIndex  # noqa: E402
from hashing import hamming, phash_hex, sha256_bytes  # noqa: E402

THRESHOLD = 8


def _photo_bytes(seed: int, size=(256, 256), fmt="PNG", quality=None) -> bytes:
    """Deterministically render a distinct-looking image for a given seed."""
    img = Image.new("RGB", size, (seed * 40 % 256, 90, 160))
    draw = ImageDraw.Draw(img)
    for i in range(6):
        x = (seed * 17 + i * 31) % size[0]
        y = (seed * 13 + i * 23) % size[1]
        r = 20 + (seed * 7 + i * 11) % 60
        draw.ellipse([x, y, x + r, y + r], fill=(30, (seed * 60 + i * 40) % 256, 200))
    buf = io.BytesIO()
    save_kwargs = {"quality": quality} if quality else {}
    img.save(buf, format=fmt, **save_kwargs)
    return buf.getvalue()


def test_exact_duplicate_same_bytes():
    data = _photo_bytes(1)
    assert sha256_bytes(data) == sha256_bytes(data)


def test_similar_image_small_distance():
    """A resized + JPEG-recompressed copy stays within the similarity threshold."""
    original = _photo_bytes(3)
    img = Image.open(io.BytesIO(original)).resize((200, 200))
    buf = io.BytesIO()
    img.convert("RGB").save(buf, format="JPEG", quality=70)
    edited = buf.getvalue()

    dist = hamming(phash_hex(original), phash_hex(edited))
    assert dist <= THRESHOLD, f"expected similar (<= {THRESHOLD}), got {dist}"


def test_different_images_large_distance():
    a = _photo_bytes(2)
    b = _photo_bytes(99)
    dist = hamming(phash_hex(a), phash_hex(b))
    assert dist > THRESHOLD, f"expected different (> {THRESHOLD}), got {dist}"


def test_index_ranks_and_thresholds_matches():
    """End-to-end query against a temp SQLite index (no network)."""
    with tempfile.TemporaryDirectory() as tmp:
        index = PhotoIndex(os.path.join(tmp, "t.db"))

        stored = _photo_bytes(5)
        stored_sha, stored_ph = sha256_bytes(stored), phash_hex(stored)
        index.upsert(
            channel_id=-100123,
            message_id=10,
            file_unique_id="u10",
            sha256=stored_sha,
            phash=stored_ph,
            date="2024-01-01T00:00:00",
            link="https://t.me/c/123/10",
        )
        other = _photo_bytes(80)
        index.upsert(
            channel_id=-100123,
            message_id=11,
            file_unique_id="u11",
            sha256=sha256_bytes(other),
            phash=phash_hex(other),
            date="2024-01-02T00:00:00",
            link="https://t.me/c/123/11",
        )

        # Exact query -> exact hit on message 10.
        exact_hits = index.find_matches(stored_sha, stored_ph, THRESHOLD, 5)
        assert exact_hits[0].message_id == 10
        assert exact_hits[0].exact is True
        assert exact_hits[0].distance == 0

        # A recompressed variant -> still matches message 10, not the other one.
        img = Image.open(io.BytesIO(stored)).resize((220, 220))
        buf = io.BytesIO()
        img.convert("RGB").save(buf, format="JPEG", quality=75)
        variant = buf.getvalue()
        sim_hits = index.find_matches(
            sha256_bytes(variant), phash_hex(variant), THRESHOLD, 5
        )
        assert any(m.message_id == 10 for m in sim_hits)
        assert all(m.message_id != 11 for m in sim_hits)

        # A totally unrelated image -> no matches under threshold.
        none_img = _photo_bytes(42)
        no_hits = index.find_matches(
            sha256_bytes(none_img), phash_hex(none_img), THRESHOLD, 5
        )
        assert no_hits == []

        index.close()
