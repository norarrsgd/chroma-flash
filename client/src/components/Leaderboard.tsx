import { useEffect, useState } from 'react';
import { Score } from '../types';
import { getScores } from '../services/api';

interface Props {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: Props) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScores()
      .then(setScores)
      .catch((err) => console.error('Failed to load scores:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="leaderboard">
      <h1 className="leaderboard-title">Leaderboard</h1>
      {loading ? (
        <p className="leaderboard-loading">Loading...</p>
      ) : scores.length === 0 ? (
        <p className="leaderboard-empty">No scores yet. Be the first!</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Score</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.player_name}</td>
                <td>{s.score}</td>
                <td>{s.level_reached}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="btn btn-secondary" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
