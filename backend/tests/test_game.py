import pytest

from game import is_winning, score_guess


def colors(secret: str, guess: str) -> list[str]:
    return [t["color"] for t in score_guess(secret, guess)]


def test_all_green_when_guess_matches_secret():
    assert colors("CRANE", "CRANE") == ["green"] * 5
    assert is_winning(score_guess("CRANE", "CRANE"))


def test_all_gray_when_no_letters_match():
    assert colors("CRANE", "PILOT") == ["gray"] * 5


def test_pure_yellows_when_letters_present_but_misplaced():
    # ARISE / SERIA shares all letters but no positions.
    assert colors("ARISE", "SERIA") == ["yellow"] * 5


def test_duplicate_letters_extra_marked_gray_not_yellow():
    # Spec example: secret CRANE, guess CREED.
    # C=green, R=green, E=yellow (only one E in secret),
    # E=gray (already used), D=gray.
    assert colors("CRANE", "CREED") == [
        "green",
        "green",
        "yellow",
        "gray",
        "gray",
    ]


def test_duplicate_letter_one_correct_one_misplaced():
    # secret ALLEY, guess LLAMA -> first L yellow, second L green,
    # A green, M gray, A gray.
    assert colors("ALLEY", "LLAMA") == [
        "yellow",
        "green",
        "yellow",
        "gray",
        "gray",
    ]


def test_duplicate_letter_two_correct_positions():
    # secret SASSY, guess SISSY -> S=green, I=gray, S=green, S=green, Y=green.
    assert colors("SASSY", "SISSY") == [
        "green",
        "gray",
        "green",
        "green",
        "green",
    ]


def test_case_insensitive():
    assert colors("crane", "Crane") == ["green"] * 5


def test_invalid_length_raises():
    with pytest.raises(ValueError):
        score_guess("CRANE", "TOO")
    with pytest.raises(ValueError):
        score_guess("HI", "CRANE")


def test_letters_carry_through_in_result():
    result = score_guess("CRANE", "PIXEL")
    assert [t["letter"] for t in result] == ["P", "I", "X", "E", "L"]
