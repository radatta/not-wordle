import type {
  AnswerResponse,
  GuessResponse,
  NewGameResponse,
  SessionResponse,
} from "./types";

const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(
  /\/$/,
  ""
);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let detail: string | undefined;
    try {
      const body = await res.json();
      detail = body?.detail;
    } catch {
      // ignore parse errors
    }
    throw new Error(detail ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function newGame(): Promise<NewGameResponse> {
  return request<NewGameResponse>("/api/new-game", {
    method: "POST",
    body: "{}",
  });
}

export async function submitGuess(
  sessionId: string,
  guess: string
): Promise<GuessResponse> {
  return request<GuessResponse>("/api/guess", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, guess }),
  });
}

export async function getAnswer(sessionId: string): Promise<AnswerResponse> {
  const qs = new URLSearchParams({ session_id: sessionId });
  return request<AnswerResponse>(`/api/answer?${qs}`);
}

export async function getSession(
  sessionId: string
): Promise<SessionResponse> {
  const qs = new URLSearchParams({ session_id: sessionId });
  return request<SessionResponse>(`/api/session?${qs}`);
}
