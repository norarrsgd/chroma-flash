import { useState } from 'react';
import { saveScore } from '../services/api';

interface Props {
  score: number;
  level: number;
  playerName: string;
  onPlayAgain: () => void;
}

export default function GameOver({ score, level, playerName, onPlayAgain }: Props) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveScore(playerName, score, level);
      setSaved(true);
    } catch (err) {
      console.error('Failed to save score:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gameover-screen">
      <h1 className="gameover-title">Game Over</h1>
      <div className="gameover-stats">
        <p className="gameover-score">{score}</p>
        <p className="gameover-label">Final Score</p>
        <p className="gameover-level">Level Reached: {level}</p>
      </div>
      <div className="gameover-actions">
        {!saved ? (
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Score'}
          </button>
        ) : (
          <p className="gameover-saved">Score saved!</p>
        )}
        <button className="btn btn-secondary" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
