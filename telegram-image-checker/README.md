# Telegram Image Checker

Send a photo to a Telegram bot and it tells you whether the **same or a visually
similar image already exists** in a target channel or group.

## Why two Telegram logins?

The Telegram **Bot API cannot read a channel's message history** — a bot only
sees messages posted after it joins. So this project uses **two clients**, both
via [Telethon](https://docs.telethon.dev):

| Client | Login | Job |
| --- | --- | --- |
| **User account** (MTProto) | phone + `api_id`/`api_hash` | Reads the channel's full photo history and indexes it. Must be a **member** of the channel. |
| **Bot** | bot token from @BotFather | The DM interface: you send it a photo, it replies with matches. |

## How matching works

For every photo (in the channel and the one you send to check) two signals are computed:

- **SHA-256** of the raw bytes → catches **exact** duplicates.
- A 64-bit **perceptual hash** (`phash`) → catches **similar** images (resized,
  re-compressed, lightly edited). Two images are "similar" when the Hamming
  distance between their perceptual hashes is `≤ PHASH_THRESHOLD` (default `8`).

Hashes are stored in a local SQLite file (`index.db`). A query does an exact
SHA-256 lookup, then a Hamming scan for near-duplicates, and returns the closest
matches with deep links to the original messages.

## Setup

1. **Python 3.10+** and dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. **Telegram API credentials** — go to <https://my.telegram.org> → *API
   development tools* → note your `api_id` and `api_hash`.

3. **Create a bot** — talk to [@BotFather](https://t.me/BotFather), `/newbot`,
   copy the token.

4. **Join the channel** — the *user account* you'll log in with must be a member
   of the channel/group you want to scan.

5. **Configure** — copy the example env file and fill it in:
   ```bash
   cp .env.example .env
   # edit .env: API_ID, API_HASH, PHONE, BOT_TOKEN, TARGET_CHANNEL, ...
   ```

## Usage

**1. Index the channel's existing history** (one-off; resumable):

```bash
python main.py backfill
```

The first run prompts for the login code Telegram sends to your phone, then
creates a reusable `user.session` file. It walks the whole photo history and
stores hashes in `index.db`. Re-run any time to pick up what's new.

**2. Run the bot** (also keeps indexing new posts live):

```bash
python main.py run
```

Now DM the bot a photo. It replies with either:

- 🚨 an **exact duplicate** link,
- ⚠️ one or more **similar image** links (with a similarity distance), or
- ✅ *no matching or similar image found*.

Bot commands (private chat): `/start`, `/stats`, `/reindex` (admin only, if
`ADMIN_USER_ID` is set).

## Configuration reference

See [`.env.example`](.env.example). Key knobs:

- `PHASH_THRESHOLD` — max Hamming distance still counted as "similar" (`0`–`64`,
  default `8`). Lower = stricter, higher = looser.
- `MAX_RESULTS` — how many matches to list per reply.
- `ADMIN_USER_ID` — numeric user id allowed to run `/reindex` (blank = anyone).

## Testing

The matching core is covered by tests that need **no Telegram credentials**:

```bash
python -m pytest
```

They verify exact-duplicate detection, similar-image detection across a
resize + JPEG recompress, and the threshold/ranking of the SQLite query.

## Notes & limitations

- Covers **photos and image documents**; videos/stickers are not matched.
- Similarity search is a linear Hamming scan — fine for tens of thousands of
  images. For much larger channels, swap in a BK-tree in `db.find_matches`.
- `.session`, `.env`, and `*.db` are git-ignored — never commit them.
