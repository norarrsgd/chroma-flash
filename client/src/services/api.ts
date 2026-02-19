import { GenerateResponse, Score } from '../types';

const API_BASE = '/api';

export async function generateRound(level: number): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/game/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level }),
  });
  if (!res.ok) throw new Error('Failed to generate round');
  return res.json();
}

export async function getScores(): Promise<Score[]> {
  const res = await fetch(`${API_BASE}/scores`);
  if (!res.ok) throw new Error('Failed to fetch scores');
  return res.json();
}

export async function saveScore(
  playerName: string,
  score: number,
  levelReached: number
): Promise<void> {
  const res = await fetch(`${API_BASE}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerName,
      score,
      levelReached,
    }),
  });
  if (!res.ok) throw new Error('Failed to save score');
}
