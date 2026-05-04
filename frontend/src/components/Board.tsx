import { Row } from "./Row";
import type { TileColor, TileResult } from "../types";

const MAX_GUESSES = 5;

interface BoardProps {
  guesses: TileResult[][];
  currentGuess: string;
  shakeRow: boolean;
}

function buildCurrentTiles(currentGuess: string) {
  return Array(5)
    .fill(null)
    .map((_, i) => ({
      letter: currentGuess[i] ?? "",
      color: "empty" as TileColor,
    }));
}

function buildEmptyTiles() {
  return Array(5)
    .fill(null)
    .map(() => ({ letter: "", color: "empty" as TileColor }));
}

export function Board({ guesses, currentGuess, shakeRow }: BoardProps) {
  const rows = [];

  // Submitted guesses
  for (let i = 0; i < guesses.length; i++) {
    rows.push(
      <Row
        key={`submitted-${i}`}
        tiles={guesses[i]}
        revealed={true}
        shake={false}
      />
    );
  }

  // Current active row (if game still going)
  if (guesses.length < MAX_GUESSES) {
    rows.push(
      <Row
        key="current"
        tiles={buildCurrentTiles(currentGuess)}
        revealed={false}
        shake={shakeRow}
      />
    );
  }

  // Empty rows
  const emptyCount = MAX_GUESSES - guesses.length - (guesses.length < MAX_GUESSES ? 1 : 0);
  for (let i = 0; i < emptyCount; i++) {
    rows.push(
      <Row
        key={`empty-${i}`}
        tiles={buildEmptyTiles()}
        revealed={false}
        shake={false}
      />
    );
  }

  return (
    <div className="flex flex-col gap-1.5 my-4">
      {rows}
    </div>
  );
}
