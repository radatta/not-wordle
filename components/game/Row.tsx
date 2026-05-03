"use client";

import { Tile } from "./Tile";
import type { TileResult, TileColor } from "@/lib/api";

interface RowProps {
  tiles: { letter: string; color: TileColor }[];
  revealed: boolean;
  shake: boolean;
}

export function Row({ tiles, revealed, shake }: RowProps) {
  return (
    <div
      className={`flex gap-1.5 ${shake ? "animate-shake" : ""}`}
    >
      {tiles.map((tile, i) => (
        <Tile
          key={i}
          letter={tile.letter}
          color={tile.color}
          revealed={revealed}
          colIndex={i}
        />
      ))}
    </div>
  );
}
