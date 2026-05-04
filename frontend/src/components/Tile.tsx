import { useEffect, useState } from "react";
import type { TileColor } from "../types";

interface TileProps {
  letter: string;
  color: TileColor;
  revealed: boolean;
  colIndex: number;
  /** Trigger a celebratory bounce after a winning row finishes flipping. */
  won?: boolean;
}

const colorStyles: Record<TileColor, string> = {
  green: "bg-[#538d4e] border-[#538d4e] text-white",
  yellow: "bg-[#b59f3b] border-[#b59f3b] text-white",
  gray: "bg-[#3a3a3c] border-[#3a3a3c] text-white",
  empty: "bg-transparent border-[#3a3a3c] text-white",
};

const FLIP_PER_TILE_MS = 300;
const WIN_BOUNCE_DELAY_PER_TILE_MS = 100;

export function Tile({ letter, color, revealed, colIndex, won }: TileProps) {
  const [flipped, setFlipped] = useState(false);
  const [displayColor, setDisplayColor] = useState<TileColor>("empty");
  const [pop, setPop] = useState(false);
  const [winning, setWinning] = useState(false);

  // Reveal flip + color swap.
  useEffect(() => {
    if (revealed && color !== "empty") {
      const delay = colIndex * FLIP_PER_TILE_MS;
      const timer = setTimeout(() => {
        setFlipped(true);
        const colorTimer = setTimeout(() => setDisplayColor(color), 150);
        return () => clearTimeout(colorTimer);
      }, delay);
      return () => clearTimeout(timer);
    } else if (!revealed) {
      setFlipped(false);
      setDisplayColor("empty");
    }
  }, [revealed, color, colIndex]);

  // Letter-typed pop animation on the active row.
  useEffect(() => {
    if (!revealed && letter) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 130);
      return () => clearTimeout(t);
    }
    if (!letter) setPop(false);
  }, [letter, revealed]);

  // Winning bounce, fired after the reveal flip on a green tile.
  useEffect(() => {
    if (!won || color !== "green" || !revealed) return;
    const flipsDone = 5 * FLIP_PER_TILE_MS + 100;
    const delay = flipsDone + colIndex * WIN_BOUNCE_DELAY_PER_TILE_MS;
    const t = setTimeout(() => setWinning(true), delay);
    return () => {
      clearTimeout(t);
      setWinning(false);
    };
  }, [won, color, revealed, colIndex]);

  const hasLetter = letter && letter.trim() !== "";
  const currentColorClass = colorStyles[displayColor];
  const borderClass =
    !revealed && hasLetter
      ? "border-[#737373] bg-transparent text-white"
      : currentColorClass;

  return (
    <div
      className={`relative w-14 h-14 ${pop ? "animate-pop" : ""} ${
        winning ? "animate-win" : ""
      }`}
      style={{ perspective: "260px" }}
    >
      <div
        className="w-full h-full transition-transform duration-300 rounded-md"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateX(180deg)" : "rotateX(0deg)",
          transitionDelay: revealed ? `${colIndex * FLIP_PER_TILE_MS}ms` : "0ms",
        }}
      >
        {/* Front face */}
        <div
          className={`absolute inset-0 flex items-center justify-center border-2 rounded-md text-[1.6rem] leading-none font-bold uppercase select-none transition-colors ${
            !flipped ? borderClass : "bg-transparent border-transparent"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {!flipped ? letter : ""}
        </div>
        {/* Back face */}
        <div
          className={`absolute inset-0 flex items-center justify-center border-2 rounded-md text-[1.6rem] leading-none font-bold uppercase select-none ${currentColorClass}`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
          }}
        >
          {letter}
        </div>
      </div>
    </div>
  );
}
