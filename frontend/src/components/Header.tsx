interface HeaderProps {
  onHelp: () => void;
  onNewGame: () => void;
}

const miniTiles: Array<{ letter: string; cls: string }> = [
  { letter: "W", cls: "bg-[#538d4e]" },
  { letter: "O", cls: "bg-[#b59f3b]" },
  { letter: "R", cls: "bg-[#3a3a3c]" },
  { letter: "D", cls: "bg-[#3a3a3c]" },
];

export function Header({ onHelp, onNewGame }: HeaderProps) {
  return (
    <header className="w-full border-b border-[#2a2a2c] bg-[#0f0f10]/70 backdrop-blur-sm sticky top-0 z-30">
      <div className="w-full max-w-2xl mx-auto px-4 py-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Left: Help */}
        <div className="flex justify-start">
          <button
            onClick={onHelp}
            aria-label="How to play"
            className="text-[#9b9b9d] hover:text-white transition-colors p-2 -ml-2 rounded-md cursor-pointer"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
        </div>

        {/* Center: Title with mini wordmark */}
        <div className="flex items-center gap-2 select-none">
          <div className="hidden sm:flex gap-[3px]" aria-hidden="true">
            {miniTiles.map((t, i) => (
              <span
                key={i}
                className={`w-5 h-5 rounded-[3px] flex items-center justify-center text-[11px] font-extrabold text-white ${t.cls}`}
              >
                {t.letter}
              </span>
            ))}
          </div>
          <h1 className="text-[1.05rem] sm:text-xl font-extrabold tracking-[0.18em] uppercase text-white whitespace-nowrap">
            Definitely Not Wordle
          </h1>
        </div>

        {/* Right: New game */}
        <div className="flex justify-end">
          <button
            onClick={onNewGame}
            aria-label="New game"
            className="text-[#9b9b9d] hover:text-white transition-colors p-2 -mr-2 rounded-md cursor-pointer"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
