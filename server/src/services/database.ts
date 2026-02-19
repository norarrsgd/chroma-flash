import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', '..', 'chroma-flash.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    level_reached INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface ScoreRecord {
  id: number;
  player_name: string;
  score: number;
  level_reached: number;
  created_at: string;
}

export function getTopScores(limit: number = 20): ScoreRecord[] {
  const stmt = db.prepare(
    'SELECT * FROM scores ORDER BY score DESC LIMIT ?'
  );
  return stmt.all(limit) as ScoreRecord[];
}

export function saveScore(
  playerName: string,
  score: number,
  levelReached: number
): void {
  const stmt = db.prepare(
    'INSERT INTO scores (player_name, score, level_reached) VALUES (?, ?, ?)'
  );
  stmt.run(playerName, score, levelReached);
}
