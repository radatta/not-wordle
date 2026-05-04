import { Tile } from "./Tile";
import type { TileColor } from "../types";

interface RowProps {
  tiles: { letter: string; color: TileColor }[];
  revealed: boolean;
  shake: boolean;
  won?: boolean;
}

export function Row({ tiles, revealed, shake, won }: RowProps) {
  return (
    <div className={`flex gap-1.5 ${shake ? "animate-shake" : ""}`}>
      {tiles.map((tile, i) => (
        <Tile
          key={i}
          letter={tile.letter}
          color={tile.color}
          revealed={revealed}
          colIndex={i}
          won={won}
        />
      ))}
    </div>
  );
}
