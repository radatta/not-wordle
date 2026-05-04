import { useCallback, useEffect, useRef, useState } from "react";
import { getAnswer, getSession, newGame, submitGuess } from "./api";
import type { GameStatus, TileResult } from "./types";
import { Board } from "./components/Board";
import { Keyboard } from "./components/Keyboard";
import { Modal } from "./components/Modal";
import { HelpModal } from "./components/HelpModal";
import { Header } from "./components/Header";

const SESSION_KEY = "wordle_session_id";
const HELP_SEEN_KEY = "wordle_help_seen";

export function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<TileResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [secretWord, setSecretWord] = useState<string | null>(null);
  const [shakeRow, setShakeRow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const gameOver = gameStatus !== "playing";
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1500);
  }, []);

  const startNewGame = useCallback(async () => {
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

  // Restore session on mount; if it's not on the server (cold start), start a new one.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        try {
          const session = await getSession(stored);
          if (cancelled) return;
          setSessionId(session.session_id);
          setGuesses(session.guesses);
          setGameStatus(session.status);
          if (session.status !== "playing") {
            const { answer } = await getAnswer(session.session_id);
            if (!cancelled) setSecretWord(answer);
          }
          return;
        } catch {
          // session expired (Lambda cold start) — fall through to new game
        }
      }
      if (!cancelled) await startNewGame();
    })();
    return () => {
      cancelled = true;
    };
  }, [startNewGame]);

  // Show How-to-play once on first visit.
  useEffect(() => {
    if (!localStorage.getItem(HELP_SEEN_KEY)) {
      setShowHelp(true);
      localStorage.setItem(HELP_SEEN_KEY, "1");
    }
  }, []);

  const handleKey = useCallback(
    async (key: string) => {
      if (gameOver || submitting || !sessionId || showHelp) return;

      if (key === "BACK" || key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      if (key === "ENTER") {
        if (currentGuess.length < 5) {
          setShakeRow(true);
          showToast("Not enough letters");
          setTimeout(() => setShakeRow(false), 600);
          return;
        }

        setSubmitting(true);
        try {
          const response = await submitGuess(sessionId, currentGuess);
          setGuesses((prev) => [...prev, response.result]);
          setCurrentGuess("");
          setGameStatus(response.status);

          if (response.status !== "playing") {
            const { answer } = await getAnswer(sessionId);
            setSecretWord(answer);
          }
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : "Something went wrong";
          showToast(msg);
          setShakeRow(true);
          setTimeout(() => setShakeRow(false), 600);
        } finally {
          setSubmitting(false);
        }
        return;
      }

      if (/^[a-zA-Z]$/.test(key)) {
        if (currentGuess.length < 5) {
          setCurrentGuess((prev) => prev + key.toUpperCase());
        }
      }
    },
    [gameOver, submitting, sessionId, currentGuess, showToast, showHelp]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape" && showHelp) {
        setShowHelp(false);
        return;
      }
      handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey, showHelp]);

  const handleNewGameClick = useCallback(() => {
    if (!gameOver) {
      const ok = window.confirm(
        "Start a new game? Your current progress will be lost."
      );
      if (!ok) return;
    }
    void startNewGame();
  }, [gameOver, startNewGame]);

  return (
    <div className="min-h-screen text-white flex flex-col items-center font-sans">
      <Header
        onHelp={() => setShowHelp(true)}
        onNewGame={handleNewGameClick}
      />

      {toast && (
        <div
          key={toast}
          className="fixed top-20 left-1/2 z-40 bg-white text-black font-semibold text-sm px-4 py-2 rounded-lg shadow-lg pointer-events-none animate-toast"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}

      <main className="flex flex-col items-center flex-1 pt-4 sm:pt-6 pb-4 w-full">
        <Board
          guesses={guesses}
          currentGuess={currentGuess}
          shakeRow={shakeRow}
          gameStatus={gameStatus}
        />

        <div className="mt-auto pt-4 w-full">
          <Keyboard guesses={guesses} onKey={handleKey} />
        </div>
      </main>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {gameOver && !showHelp && (
        <Modal
          status={gameStatus as "won" | "lost"}
          guessCount={guesses.length}
          secretWord={secretWord}
          onNewGame={startNewGame}
        />
      )}
    </div>
  );
}
