# Not Wordle

Not a wordle clone!


```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Browser         │───▶│  CloudFront + S3 │───▶│  Vite static     │
│                  │    │                  │    │  React build     │
└──────────────────┘    └──────────────────┘    └──────────────────┘
         │
         │   /api/*
         ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Lambda          │───▶│  FastAPI         │───▶│  In-memory       │
│  Function URL    │    │  (Mangum)        │    │  session dict    │
│                  │    │                  │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

## Repo layout

```
not-wordle/
├── backend/              FastAPI app + scoring + Lambda handler
│   ├── main.py
│   ├── game.py
│   ├── words.py
│   ├── lambda_handler.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   └── tests/
└── frontend/             Vite + React + TypeScript
    ├── src/
    │   ├── components/   Board, Row, Tile, Keyboard, Modal
    │   ├── App.tsx
    │   ├── api.ts
    │   ├── types.ts
    │   └── main.tsx
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

## Running locally

### Backend

```bash
cd backend
uv venv --python 3.12
source .venv/bin/activate
uv pip install -r requirements-dev.txt
uvicorn main:app --reload --port 8000
# Swagger UI → http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
bun install
echo 'VITE_API_URL=http://localhost:8000' > .env.local
bun run dev
# App → http://localhost:5173
```

### Tests

```bash
cd backend
source .venv/bin/activate
pytest -v
```

## API

| Method | Endpoint          | Body / Query                        | Response                                                     |
| ------ | ----------------- | ----------------------------------- | ------------------------------------------------------------ |
| POST   | `/api/new-game`   | `{}`                                | `{ session_id }`                                             |
| POST   | `/api/guess`      | `{ session_id, guess }`             | `{ result: [{letter, color}], status, guesses_left }`        |
| GET    | `/api/answer`     | `?session_id=…`                     | `{ answer }`                                                 |
| GET    | `/api/session`    | `?session_id=…`                     | `{ session_id, guesses, status, guesses_left }` (rehydrate)  |
| GET    | `/api/health`     | —                                   | `{ ok: true }`                                               |

`/api/session` is an addition to the spec's four endpoints — the spec
says `sessionId` is restored from `localStorage` on load, but doesn't
define a way to fetch the attached state. This endpoint fills that gap
so a refresh resumes the game in progress.

## Game logic

Two-pass scoring (`backend/game.py`):

1. Mark all green tiles, recording which secret-word positions are now
   consumed.
2. For each remaining tile, mark yellow only if the secret still has an
   unconsumed occurrence of that letter; otherwise gray.

This handles the tricky duplicate-letter case correctly. Example with
`secret=CRANE, guess=CREED`:

```
C  R  E  E  D
🟩 🟩 🟨 ⬜ ⬜
```

The first `E` is yellow (one `E` exists in the secret), the second `E`
is gray (the secret's only `E` was already consumed).

## AWS deployment

- **Backend**: ZIP `backend/` + site-packages, upload to a Python 3.12
  Lambda, set handler to `lambda_handler.handler`, enable a Function URL
  (auth: NONE), set `ALLOWED_ORIGINS` env var to the CloudFront domain.
- **Frontend**: `bun run build`, sync `dist/` to an S3 bucket, front it
  with CloudFront. Set `VITE_API_URL` to the Lambda Function URL before
  the build.

## Environment variables

| Variable          | Side    | Default                  | Notes                                  |
| ----------------- | ------- | ------------------------ | -------------------------------------- |
| `VITE_API_URL`    | frontend| `http://localhost:8000`  | Backend base URL the SPA calls.        |
| `ALLOWED_ORIGINS` | backend | `*`                      | Comma-separated CORS allow-list.       |
