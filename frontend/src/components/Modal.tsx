import { useEffect, useRef } from "react";

interface ModalProps {
  status: "won" | "lost";
  guessCount: number;
  secretWord: string | null;
  onNewGame: () => void;
}

export function Modal({
  status,
  guessCount,
  secretWord,
  onNewGame,
}: ModalProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = setTimeout(() => buttonRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm animate-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={status === "won" ? "You won!" : "Game over"}
    >
      <div className="bg-[#1a1a1b] border border-[#3a3a3c] rounded-2xl p-8 flex flex-col items-center gap-5 w-full max-w-sm mx-4 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] animate-modal-content">
        {status === "won" ? (
          <>
            <div className="text-5xl" aria-hidden="true">
              🎉
            </div>
            <h2 className="text-white text-3xl font-bold text-center text-balance">
              Genius!
            </h2>
            <p className="text-[#9b9b9d] text-center text-lg">
              You got it in{" "}
              <span className="text-white font-semibold">{guessCount}</span>{" "}
              {guessCount === 1 ? "guess" : "guesses"}
            </p>
            {secretWord && (
              <p className="text-[#9b9b9d] text-center -mt-2">
                The word was{" "}
                <span className="text-white font-bold tracking-widest">
                  {secretWord}
                </span>
              </p>
            )}
          </>
        ) : (
          <>
            <div className="text-5xl" aria-hidden="true">
              😔
            </div>
            <h2 className="text-white text-3xl font-bold text-center text-balance">
              Better luck next time
            </h2>
            {secretWord && (
              <p className="text-[#9b9b9d] text-center text-lg">
                The word was{" "}
                <span className="text-white font-bold tracking-widest">
                  {secretWord}
                </span>
              </p>
            )}
          </>
        )}
        <button
          ref={buttonRef}
          onClick={onNewGame}
          className="mt-2 w-full py-3 rounded-xl bg-[#538d4e] hover:bg-[#62a05c] active:scale-[0.98] text-white font-bold text-lg transition-[background-color,transform] focus:outline-none focus:ring-2 focus:ring-[#538d4e] focus:ring-offset-2 focus:ring-offset-[#1a1a1b]"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
