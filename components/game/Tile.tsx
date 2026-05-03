"use client";

import { useEffect, useState } from "react";
import type { TileColor } from "@/lib/api";

interface TileProps {
  letter: string;
  color: TileColor;
  revealed: boolean;
  colIndex: number;
}

const colorStyles: Record<TileColor, string> = {
  green: "bg-[#538d4e] border-[#538d4e] text-white",
  yellow: "bg-[#b59f3b] border-[#b59f3b] text-white",
  gray: "bg-[#3a3a3c] border-[#3a3a3c] text-white",
  empty: "bg-transparent border-[#565758] text-white",
};

export function Tile({ letter, color, revealed, colIndex }: TileProps) {
  const [flipped, setFlipped] = useState(false);
  const [displayColor, setDisplayColor] = useState<TileColor>("empty");

  useEffect(() => {
    if (revealed && color !== "empty") {
      const delay = colIndex * 300;
      const timer = setTimeout(() => {
        setFlipped(true);
        // Update color mid-flip
        const colorTimer = setTimeout(() => {
          setDisplayColor(color);
        }, 150);
        return () => clearTimeout(colorTimer);
      }, delay);
      return () => clearTimeout(timer);
    } else if (!revealed) {
      setFlipped(false);
      setDisplayColor("empty");
    }
  }, [revealed, color, colIndex]);

  const hasLetter = letter && letter.trim() !== "";
  const currentColorClass = colorStyles[displayColor];
  const borderClass =
    !revealed && hasLetter ? "border-[#999]" : currentColorClass;

  return (
    <div
      className="relative w-14 h-14"
      style={{ perspective: "250px" }}
    >
      <div
        className="w-full h-full transition-transform duration-300"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateX(180deg)" : "rotateX(0deg)",
          transitionDelay: revealed ? `${colIndex * 300}ms` : "0ms",
        }}
      >
        {/* Front face */}
        <div
          className={`absolute inset-0 flex items-center justify-center border-2 text-2xl font-bold uppercase select-none ${
            !flipped ? borderClass : "bg-transparent border-transparent"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {!flipped ? letter : ""}
        </div>
        {/* Back face */}
        <div
          className={`absolute inset-0 flex items-center justify-center border-2 text-2xl font-bold uppercase select-none ${currentColorClass}`}
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
