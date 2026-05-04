"""FastAPI app for Definitely Not Wordle.

In-memory session storage keyed by UUID. Sessions reset on Lambda cold
start, which is fine for the demo — a new game is one click away.
"""

from __future__ import annotations

import os
import uuid
from typing import Literal, TypedDict

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from game import WORD_LENGTH, is_winning, score_guess
from words import is_valid_guess, random_answer

MAX_GUESSES = 5

app = FastAPI(
    title="Definitely Not Wordle",
    description="Backend API for the Definitely Not Wordle game.",
    version="0.1.0",
)

_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = (
    [o.strip() for o in _origins_env.split(",") if o.strip()]
    if _origins_env != "*"
    else ["*"]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class _Session(TypedDict):
    secret: str
    guesses: list[list[dict[str, str]]]  # list of TileResult rows
    status: Literal["playing", "won", "lost"]


sessions: dict[str, _Session] = {}


def _guesses_left(session: _Session) -> int:
    return max(0, MAX_GUESSES - len(session["guesses"]))


def _get_session(session_id: str) -> _Session:
    session = sessions.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="session not found")
    return session


# ─── Schemas ────────────────────────────────────────────────────────────────


class NewGameResponse(BaseModel):
    session_id: str


class GuessRequest(BaseModel):
    session_id: str
    guess: str = Field(min_length=WORD_LENGTH, max_length=WORD_LENGTH)


class GuessResponse(BaseModel):
    result: list[dict[str, str]]
    status: Literal["playing", "won", "lost"]
    guesses_left: int


class AnswerResponse(BaseModel):
    answer: str


class SessionResponse(BaseModel):
    session_id: str
    guesses: list[list[dict[str, str]]]
    status: Literal["playing", "won", "lost"]
    guesses_left: int


class HealthResponse(BaseModel):
    ok: bool


# ─── Routes ─────────────────────────────────────────────────────────────────


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(ok=True)


@app.post("/api/new-game", response_model=NewGameResponse)
def new_game() -> NewGameResponse:
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "secret": random_answer(),
        "guesses": [],
        "status": "playing",
    }
    return NewGameResponse(session_id=session_id)


@app.post("/api/guess", response_model=GuessResponse)
def submit_guess(payload: GuessRequest) -> GuessResponse:
    session = _get_session(payload.session_id)
    if session["status"] != "playing":
        raise HTTPException(status_code=400, detail="game is over")

    if not is_valid_guess(payload.guess):
        raise HTTPException(
            status_code=400, detail="guess must be 5 letters (A-Z)"
        )

    result = score_guess(session["secret"], payload.guess)
    session["guesses"].append(list(result))

    if is_winning(result):
        session["status"] = "won"
    elif len(session["guesses"]) >= MAX_GUESSES:
        session["status"] = "lost"

    return GuessResponse(
        result=list(result),
        status=session["status"],
        guesses_left=_guesses_left(session),
    )


@app.get("/api/answer", response_model=AnswerResponse)
def get_answer(session_id: str = Query(...)) -> AnswerResponse:
    session = _get_session(session_id)
    return AnswerResponse(answer=session["secret"])


@app.get("/api/session", response_model=SessionResponse)
def get_session_state(session_id: str = Query(...)) -> SessionResponse:
    session = _get_session(session_id)
    return SessionResponse(
        session_id=session_id,
        guesses=session["guesses"],
        status=session["status"],
        guesses_left=_guesses_left(session),
    )
