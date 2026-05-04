"""End-to-end tests for the FastAPI routes.

We patch words.random_answer so we get a deterministic secret per test
and can verify scoring + state transitions without flakiness.
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

import main
import words


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setattr(words, "random_answer", lambda *_args, **_kw: "CRANE")
    monkeypatch.setattr(main, "random_answer", lambda *_args, **_kw: "CRANE")
    main.sessions.clear()
    return TestClient(main.app)


def test_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"ok": True}


def test_new_game_returns_session_id(client):
    res = client.post("/api/new-game", json={})
    assert res.status_code == 200
    body = res.json()
    assert isinstance(body["session_id"], str)
    assert len(body["session_id"]) > 0


def test_full_game_win(client):
    sid = client.post("/api/new-game", json={}).json()["session_id"]

    # Wrong guess.
    res = client.post(
        "/api/guess", json={"session_id": sid, "guess": "PILOT"}
    )
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "playing"
    assert body["guesses_left"] == 4
    assert [t["color"] for t in body["result"]] == ["gray"] * 5

    # Winning guess.
    res = client.post(
        "/api/guess", json={"session_id": sid, "guess": "crane"}
    )
    body = res.json()
    assert body["status"] == "won"
    assert [t["color"] for t in body["result"]] == ["green"] * 5


def test_full_game_loss(client):
    sid = client.post("/api/new-game", json={}).json()["session_id"]
    for _ in range(4):
        res = client.post(
            "/api/guess", json={"session_id": sid, "guess": "PILOT"}
        )
        assert res.json()["status"] == "playing"

    res = client.post(
        "/api/guess", json={"session_id": sid, "guess": "PILOT"}
    )
    body = res.json()
    assert body["status"] == "lost"
    assert body["guesses_left"] == 0

    answer = client.get("/api/answer", params={"session_id": sid}).json()
    assert answer == {"answer": "CRANE"}


def test_guess_after_game_over_rejected(client):
    sid = client.post("/api/new-game", json={}).json()["session_id"]
    client.post("/api/guess", json={"session_id": sid, "guess": "CRANE"})
    res = client.post(
        "/api/guess", json={"session_id": sid, "guess": "PILOT"}
    )
    assert res.status_code == 400


def test_guess_invalid_length(client):
    sid = client.post("/api/new-game", json={}).json()["session_id"]
    res = client.post("/api/guess", json={"session_id": sid, "guess": "HI"})
    # Pydantic 422 for length mismatch.
    assert res.status_code == 422


def test_guess_non_alpha_rejected(client):
    sid = client.post("/api/new-game", json={}).json()["session_id"]
    res = client.post(
        "/api/guess", json={"session_id": sid, "guess": "12345"}
    )
    assert res.status_code == 400


def test_unknown_session_returns_404(client):
    res = client.post(
        "/api/guess", json={"session_id": "no-such", "guess": "CRANE"}
    )
    assert res.status_code == 404
    res = client.get("/api/answer", params={"session_id": "no-such"})
    assert res.status_code == 404
    res = client.get("/api/session", params={"session_id": "no-such"})
    assert res.status_code == 404


def test_session_endpoint_rehydrates_state(client):
    sid = client.post("/api/new-game", json={}).json()["session_id"]
    client.post("/api/guess", json={"session_id": sid, "guess": "CREED"})

    res = client.get("/api/session", params={"session_id": sid})
    body = res.json()
    assert body["session_id"] == sid
    assert body["status"] == "playing"
    assert body["guesses_left"] == 4
    assert len(body["guesses"]) == 1
    colors = [t["color"] for t in body["guesses"][0]]
    # CRANE / CREED -> green green yellow gray gray.
    assert colors == ["green", "green", "yellow", "gray", "gray"]
