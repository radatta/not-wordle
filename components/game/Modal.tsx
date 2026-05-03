"use client";

interface ModalProps {
  status: "won" | "lost";
  guessCount: number;
  secretWord: string | null;
  onNewGame: () => void;
}

export function Modal({ status, guessCount, secretWord, onNewGame }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={status === "won" ? "You won!" : "Game over"}
    >
      <div className="bg-[#1a1a1b] border border-[#565758] rounded-2xl p-8 flex flex-col items-center gap-5 w-full max-w-sm mx-4 shadow-2xl">
        {status === "won" ? (
          <>
            <div className="text-5xl" aria-hidden="true">🎉</div>
            <h2 className="text-white text-3xl font-bold text-center text-balance">
              Genius!
            </h2>
            <p className="text-[#818384] text-center text-lg">
              You got it in{" "}
              <span className="text-white font-semibold">{guessCount}</span>{" "}
              {guessCount === 1 ? "guess" : "guesses"}!
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl" aria-hidden="true">😔</div>
            <h2 className="text-white text-3xl font-bold text-center text-balance">
              Better luck next time
            </h2>
            {secretWord && (
              <p className="text-[#818384] text-center text-lg">
                The word was{" "}
                <span className="text-white font-bold tracking-widest">
                  {secretWord}
                </span>
              </p>
            )}
          </>
        )}
        <button
          onClick={onNewGame}
          className="mt-2 w-full py-3 rounded-xl bg-[#538d4e] hover:bg-[#6aaf64] text-white font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#538d4e] focus:ring-offset-2 focus:ring-offset-[#1a1a1b]"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
