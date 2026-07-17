"""SQLite index of channel photos and the matching queries.

One row per indexed photo. The perceptual hash lives in the ``phash`` column;
similarity search is a linear Hamming scan over all rows, which is fine for the
tens-of-thousands-of-images range. For much larger channels a BK-tree could
replace the linear scan without changing this interface.
"""

from __future__ import annotations

import sqlite3
from dataclasses import dataclass

from hashing import hamming

_SCHEMA = """
CREATE TABLE IF NOT EXISTS photos (
    channel_id     INTEGER NOT NULL,
    message_id     INTEGER NOT NULL,
    file_unique_id TEXT,
    sha256         TEXT NOT NULL,
    phash          TEXT NOT NULL,
    date           TEXT,
    link           TEXT,
    PRIMARY KEY (channel_id, message_id)
);
CREATE INDEX IF NOT EXISTS idx_photos_sha256 ON photos(sha256);
"""


@dataclass
class Match:
    message_id: int
    channel_id: int
    link: str
    distance: int
    exact: bool
    date: str | None


class PhotoIndex:
    """Thin wrapper around a SQLite connection holding the photo index."""

    def __init__(self, path: str):
        self.conn = sqlite3.connect(path)
        self.conn.row_factory = sqlite3.Row
        self.conn.executescript(_SCHEMA)
        self.conn.commit()

    def close(self) -> None:
        self.conn.close()

    # -- writes -------------------------------------------------------------
    def upsert(
        self,
        *,
        channel_id: int,
        message_id: int,
        file_unique_id: str | None,
        sha256: str,
        phash: str,
        date: str | None,
        link: str | None,
    ) -> None:
        self.conn.execute(
            """
            INSERT INTO photos
                (channel_id, message_id, file_unique_id, sha256, phash, date, link)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(channel_id, message_id) DO UPDATE SET
                file_unique_id=excluded.file_unique_id,
                sha256=excluded.sha256,
                phash=excluded.phash,
                date=excluded.date,
                link=excluded.link
            """,
            (channel_id, message_id, file_unique_id, sha256, phash, date, link),
        )
        self.conn.commit()

    # -- reads --------------------------------------------------------------
    def has_message(self, channel_id: int, message_id: int) -> bool:
        cur = self.conn.execute(
            "SELECT 1 FROM photos WHERE channel_id=? AND message_id=? LIMIT 1",
            (channel_id, message_id),
        )
        return cur.fetchone() is not None

    def count(self) -> int:
        return self.conn.execute("SELECT COUNT(*) AS c FROM photos").fetchone()["c"]

    def max_message_id(self, channel_id: int) -> int:
        row = self.conn.execute(
            "SELECT MAX(message_id) AS m FROM photos WHERE channel_id=?",
            (channel_id,),
        ).fetchone()
        return row["m"] or 0

    def find_matches(
        self, sha256: str, phash: str, threshold: int, limit: int
    ) -> list[Match]:
        """Return matches for a query image, closest first.

        Exact (sha256) hits are always included with distance 0. Everything
        else within ``threshold`` perceptual Hamming distance follows, sorted
        by ascending distance.
        """
        matches: list[Match] = []
        seen: set[tuple[int, int]] = set()

        for row in self.conn.execute("SELECT * FROM photos"):
            key = (row["channel_id"], row["message_id"])
            exact = row["sha256"] == sha256
            dist = 0 if exact else hamming(phash, row["phash"])
            if exact or dist <= threshold:
                matches.append(
                    Match(
                        message_id=row["message_id"],
                        channel_id=row["channel_id"],
                        link=row["link"] or "",
                        distance=dist,
                        exact=exact,
                        date=row["date"],
                    )
                )
                seen.add(key)

        # exact first (distance 0, exact flag), then by distance
        matches.sort(key=lambda m: (m.distance, not m.exact))
        return matches[:limit]
