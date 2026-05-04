"""Core scoring logic for Definitely Not Wordle.

The naive approach (mark yellow if a letter exists anywhere in the secret)
mis-handles duplicate letters. We use a two-pass algorithm:

  1. Mark greens, recording which secret-word positions are consumed.
  2. For each remaining letter, mark yellow only if the secret still has an
     unconsumed occurrence of it; otherwise mark gray.
"""

from __future__ import annotations

from typing import Literal, TypedDict

Color = Literal["green", "yellow", "gray"]

WORD_LENGTH = 5


class TileResult(TypedDict):
    letter: str
    color: Color


def score_guess(secret: str, guess: str) -> list[TileResult]:
    secret = secret.upper()
    guess = guess.upper()
    if len(secret) != WORD_LENGTH or len(guess) != WORD_LENGTH:
        raise ValueError(f"both secret and guess must be {WORD_LENGTH} letters")

    result: list[TileResult] = [
        {"letter": guess[i], "color": "gray"} for i in range(WORD_LENGTH)
    ]
    consumed = [False] * WORD_LENGTH

    # Pass 1: greens.
    for i in range(WORD_LENGTH):
        if guess[i] == secret[i]:
            result[i]["color"] = "green"
            consumed[i] = True

    # Pass 2: yellows / grays.
    for i in range(WORD_LENGTH):
        if result[i]["color"] == "green":
            continue
        for j in range(WORD_LENGTH):
            if not consumed[j] and guess[i] == secret[j]:
                result[i]["color"] = "yellow"
                consumed[j] = True
                break

    return result


def is_winning(result: list[TileResult]) -> bool:
    return all(tile["color"] == "green" for tile in result)
