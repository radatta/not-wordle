export type TileColor = "green" | "yellow" | "gray" | "empty";

export interface TileResult {
  letter: string;
  color: TileColor;
}

export interface GuessResponse {
  result: TileResult[];
  status: "playing" | "won" | "lost";
  guesses_left: number;
}

// Simulates POST /api/new-game
export async function newGame(): Promise<{ session_id: string }> {
  return { session_id: "mock-session-123" };
}

// Simulates GET /api/answer
export async function getAnswer(_sessionId: string): Promise<{ answer: string }> {
  return { answer: "CRANE" };
}

// Simulates POST /api/guess — runs real scoring logic locally
export async function submitGuess(
  _sessionId: string,
  guess: string
): Promise<GuessResponse> {
  const secret = "CRANE";
  const result = scoreGuess(secret, guess.toUpperCase());
  const won = result.every((t) => t.color === "green");
  return {
    result,
    status: won ? "won" : "lost", // App.tsx will track guess count for real status
    guesses_left: 0, // App.tsx manages this
  };
}

// Two-pass scoring — this exact logic will live in the real Python backend
function scoreGuess(secret: string, guess: string): TileResult[] {
  const result: TileResult[] = Array(5)
    .fill(null)
    .map((_, i) => ({
      letter: guess[i],
      color: "gray" as TileColor,
    }));
  const secretArr = secret.split("");
  const used = Array(5).fill(false);

  // Pass 1: greens
  for (let i = 0; i < 5; i++) {
    if (guess[i] === secret[i]) {
      result[i].color = "green";
      used[i] = true;
    }
  }

  // Pass 2: yellows
  for (let i = 0; i < 5; i++) {
    if (result[i].color === "green") continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guess[i] === secretArr[j]) {
        result[i].color = "yellow";
        used[j] = true;
        break;
      }
    }
  }

  return result;
}
