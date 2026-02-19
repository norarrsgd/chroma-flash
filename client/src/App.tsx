import { useState } from 'react';
import { useGame } from './hooks/useGame';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';

type View = 'game' | 'leaderboard';

export default function App() {
  const { game, loading, startGame, onFlashComplete, submitAnswers, nextLevel, resetGame } = useGame();
  const [view, setView] = useState<View>('game');

  if (view === 'leaderboard') {
    return <Leaderboard onBack={() => setView('game')} />;
  }

  if (game.phase === 'start') {
    return (
      <StartScreen
        onStart={(name) => startGame(name)}
        onLeaderboard={() => setView('leaderboard')}
        loading={loading}
      />
    );
  }

  if (game.phase === 'gameover') {
    return (
      <GameOver
        score={game.score}
        level={game.level}
        playerName={game.playerName}
        onPlayAgain={resetGame}
      />
    );
  }

  return (
    <Game
      game={game}
      loading={loading}
      onFlashComplete={onFlashComplete}
      submitAnswers={submitAnswers}
      nextLevel={nextLevel}
    />
  );
}
