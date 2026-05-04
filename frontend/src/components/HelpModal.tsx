interface HelpModalProps {
  onClose: () => void;
}

interface SampleTileProps {
  letter: string;
  highlight: "green" | "yellow" | "gray";
}

const tileStyles = {
  green: "bg-[#538d4e] border-[#538d4e]",
  yellow: "bg-[#b59f3b] border-[#b59f3b]",
  gray: "bg-[#3a3a3c] border-[#3a3a3c]",
};

function SampleTile({ letter, highlight }: SampleTileProps) {
  return (
    <div
      className={`w-9 h-9 flex items-center justify-center border-2 rounded text-base font-bold uppercase text-white ${tileStyles[highlight]}`}
    >
      {letter}
    </div>
  );
}

function PlainTile({ letter }: { letter: string }) {
  return (
    <div className="w-9 h-9 flex items-center justify-center border-2 border-[#565758] rounded text-base font-bold uppercase text-white">
      {letter}
    </div>
  );
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm animate-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="How to play"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1b] border border-[#3a3a3c] rounded-2xl p-7 w-full max-w-md mx-4 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] animate-modal-content thin-scroll max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-white text-2xl font-bold">How to play</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[#9b9b9d] hover:text-white transition-colors p-1 -mt-1 -mr-1 cursor-pointer"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="text-[#dcdcde] text-sm mb-2">
          Guess the secret 5-letter word in <strong>5 tries</strong>.
        </p>
        <p className="text-[#9b9b9d] text-sm mb-5">
          Each guess must be a 5-letter word. Hit Enter to submit. After each
          guess, the colors of the tiles will show how close your guess was.
        </p>

        <div className="border-t border-[#3a3a3c] pt-5 space-y-5">
          <div>
            <div className="flex gap-1.5 mb-2">
              <SampleTile letter="W" highlight="green" />
              <PlainTile letter="E" />
              <PlainTile letter="A" />
              <PlainTile letter="R" />
              <PlainTile letter="Y" />
            </div>
            <p className="text-[#dcdcde] text-sm">
              <strong>W</strong> is in the word and in the correct spot.
            </p>
          </div>

          <div>
            <div className="flex gap-1.5 mb-2">
              <PlainTile letter="P" />
              <SampleTile letter="I" highlight="yellow" />
              <PlainTile letter="L" />
              <PlainTile letter="L" />
              <PlainTile letter="S" />
            </div>
            <p className="text-[#dcdcde] text-sm">
              <strong>I</strong> is in the word but in the wrong spot.
            </p>
          </div>

          <div>
            <div className="flex gap-1.5 mb-2">
              <PlainTile letter="V" />
              <PlainTile letter="A" />
              <PlainTile letter="G" />
              <SampleTile letter="U" highlight="gray" />
              <PlainTile letter="E" />
            </div>
            <p className="text-[#dcdcde] text-sm">
              <strong>U</strong> is not in the word in any spot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
