"""Image hashing helpers.

Two independent signals are computed for every image:

* ``sha256`` of the raw file bytes -> catches *exact* duplicates (same file).
* a 64-bit perceptual hash (:func:`imagehash.phash`) -> catches *visually
  similar* images (resized, re-compressed, lightly edited) by comparing the
  Hamming distance between two hashes.

Perceptual hashes are stored as 16-char hex strings; :func:`hamming` compares
two such strings without needing Pillow, which keeps DB queries cheap.
"""

from __future__ import annotations

import hashlib
import io

import imagehash
from PIL import Image

# imagehash.phash uses hash_size=8 by default -> an 8x8 = 64-bit hash,
# rendered as 16 hex characters.
_HASH_SIZE = 8


def sha256_bytes(data: bytes) -> str:
    """Return the hex SHA-256 of raw bytes (exact-duplicate key)."""
    return hashlib.sha256(data).hexdigest()


def phash_hex(data: bytes) -> str:
    """Return the perceptual hash of an image as a 16-char hex string.

    Raises ``PIL.UnidentifiedImageError`` if ``data`` is not a readable image.
    """
    with Image.open(io.BytesIO(data)) as img:
        # Convert so mode-only differences (e.g. RGBA vs RGB) don't matter.
        return str(imagehash.phash(img.convert("RGB"), hash_size=_HASH_SIZE))


def hamming(hex_a: str, hex_b: str) -> int:
    """Hamming distance (0-64) between two perceptual-hash hex strings."""
    return imagehash.hex_to_hash(hex_a) - imagehash.hex_to_hash(hex_b)


def hash_image(data: bytes) -> tuple[str, str]:
    """Convenience: return ``(sha256, phash_hex)`` for image bytes."""
    return sha256_bytes(data), phash_hex(data)
