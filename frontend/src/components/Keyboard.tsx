import type { TileColor, TileResult } from "../types";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
];

interface KeyboardProps {
  guesses: TileResult[][];
  onKey: (key: string) => void;
}

const COLOR_PRIORITY: Record<TileColor, number> = {
  green: 3,
  yellow: 2,
  gray: 1,
  empty: 0,
};

function buildKeyColors(guesses: TileResult[][]): Record<string, TileColor> {
  const map: Record<string, TileColor> = {};
  for (const guess of guesses) {
    for (const tile of guess) {
      const current = map[tile.letter];
      if (!current || COLOR_PRIORITY[tile.color] > COLOR_PRIORITY[current]) {
        map[tile.letter] = tile.color;
      }
    }
  }
  return map;
}

const keyColorStyle: Record<TileColor | "default", string> = {
  green: "bg-[#538d4e] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]",
  yellow: "bg-[#b59f3b] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]",
  gray: "bg-[#3a3a3c] text-[#cccccc] shadow-[inset_0_-2px_0_rgba(0,0,0,0.25)]",
  empty: "bg-[#818384] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]",
  default: "bg-[#818384] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]",
};

export function Keyboard({ guesses, onKey }: KeyboardProps) {
  const keyColors = buildKeyColors(guesses);

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-[500px] mx-auto px-2">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const color = keyColors[key];
            const styleClass = color
              ? keyColorStyle[color]
              : keyColorStyle.default;
            const isWide = key === "ENTER" || key === "BACK";

            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={`
                  ${isWide ? "px-3 min-w-[65px]" : "w-10"}
                  h-14 rounded-md flex items-center justify-center
                  text-sm font-bold uppercase cursor-pointer
                  select-none transition-[background-color,transform,box-shadow] duration-150
                  hover:brightness-110 active:scale-[0.94] active:brightness-95
                  ${styleClass}
                `}
                aria-label={key === "BACK" ? "Backspace" : key}
              >
                {key === "BACK" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                    <line x1="18" y1="9" x2="12" y2="15" />
                    <line x1="12" y1="9" x2="18" y2="15" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
