"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { newGame, submitGuess, getAnswer } from "@/lib/api";
import type { TileResult } from "@/lib/api";
import { Board } from "./Board";
import { Keyboard } from "./Keyboard";
import { Modal } from "./Modal";

const MAX_GUESSES = 5;
const SESSION_KEY = "wordle_session_id";

export function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<TileResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [secretWord, setSecretWord] = useState<string | null>(null);
  const [shakeRow, setShakeRow] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const gameOver = gameStatus !== "playing";
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Init: restore or create session ──────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      setSessionId(stored);
    } else {
      newGame().then(({ session_id }) => {
        localStorage.setItem(SESSION_KEY, session_id);
        setSessionId(session_id);
      });
    }
  }, []);

  // ── Show a transient toast message ───────────────────────────────────
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1500);
  }, []);

  // ── Core input handler ────────────────────────────────────────────────
  const handleKey = useCallback(
    async (key: string) => {
      if (gameOver) return;

      if (key === "BACK" || key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      if (key === "ENTER") {
        if (currentGuess.length < 5) {
          // Shake and warn
          setShakeRow(true);
          showToast("Not enough letters");
          setTimeout(() => setShakeRow(false), 600);
          return;
        }

        const response = await submitGuess(sessionId ?? "", currentGuess);
        const newGuesses = [...guesses, response.result];
        setGuesses(newGuesses);
        setCurrentGuess("");

        const won = response.result.every((t) => t.color === "green");
        if (won) {
          setGameStatus("won");
          getAnswer(sessionId ?? "").then(({ answer }) => setSecretWord(answer));
        } else if (newGuesses.length >= MAX_GUESSES) {
          setGameStatus("lost");
          getAnswer(sessionId ?? "").then(({ answer }) => setSecretWord(answer));
        }
        return;
      }

      // Letter key
      if (/^[a-zA-Z]$/.test(key)) {
        if (currentGuess.length < 5) {
          setCurrentGuess((prev) => prev + key.toUpperCase());
        }
      }
    },
    [gameOver, currentGuess, guesses, sessionId, showToast]
  );

  // ── Physical keyboard listener ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  // ── New Game ──────────────────────────────────────────────────────────
  const handleNewGame = useCallback(async () => {
    const { session_id } = await newGame();
    localStorage.setItem(SESSION_KEY, session_id);
    setSessionId(session_id);
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
    setSecretWord(null);
    setShakeRow(false);
    setToast(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#121213] text-white flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full max-w-lg border-b border-[#3a3a3c] px-4 py-3 flex items-center justify-center">
        <h1 className="text-2xl font-bold tracking-widest uppercase text-white select-none">
          Definitely Not Wordle
        </h1>
      </header>

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-white text-black font-semibold text-sm px-4 py-2 rounded-lg shadow-lg pointer-events-none"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}

      {/* Board */}
      <main className="flex flex-col items-center flex-1 pt-6 pb-4 w-full">
        <Board
          guesses={guesses}
          currentGuess={currentGuess}
          shakeRow={shakeRow}
        />

        {/* Keyboard */}
        <div className="mt-auto pt-4 w-full">
          <Keyboard guesses={guesses} onKey={handleKey} />
        </div>
      </main>

      {/* Win/Lose Modal */}
      {gameOver && (
        <Modal
          status={gameStatus as "won" | "lost"}
          guessCount={guesses.length}
          secretWord={secretWord}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
}
