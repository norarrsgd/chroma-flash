import { useState } from 'react';

interface Props {
  onStart: (name: string) => void;
  onLeaderboard: () => void;
  loading?: boolean;
}

export default function StartScreen({ onStart, onLeaderboard, loading }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !loading) onStart(name.trim());
  };

  return (
    <div className="start-screen">
      <div className="start-card">
        <h1 className="title">ChromaFlash</h1>
        <p className="subtitle">
          Words flash before your eyes. Remember the highlighted ones.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="name-input"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!name.trim() || loading}
          >
            {loading ? 'Loading...' : 'Start Game'}
          </button>
        </form>
        <button className="btn btn-secondary" onClick={onLeaderboard} disabled={loading}>
          View Leaderboard
        </button>
      </div>
    </div>
  );
}
