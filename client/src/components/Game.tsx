import { GameState, LevelConfig } from '../types';
import HUD from './HUD';
import WordFlash from './WordFlash';
import AnswerSelect from './AnswerSelect';
import { getLevelConfig } from '../hooks/useGame';

interface Props {
  game: GameState;
  loading: boolean;
  onFlashComplete: () => void;
  submitAnswers: (selected: number[]) => void;
  nextLevel: () => void;
}

export default function Game({ game, loading, onFlashComplete, submitAnswers, nextLevel }: Props) {
  const config: LevelConfig = getLevelConfig(game.level);

  return (
    <div className="game-container">
      <HUD lives={game.lives} level={game.level} score={game.score} />

      {loading && (
        <div className="loading-text">Generating passage...</div>
      )}

      {!loading && game.phase === 'flashing' && game.words.length > 0 && (
        <WordFlash
          key={game.level}
          words={game.words}
          targetIndices={game.targetIndices}
          flashSpeed={config.flashSpeed}
          onComplete={onFlashComplete}
        />
      )}

      {game.phase === 'answering' && (
        <AnswerSelect
          words={game.words}
          targetIndices={game.targetIndices}
          onSubmit={submitAnswers}
        />
      )}

      {game.phase === 'result' && (
        <div className="result-screen">
          {game.roundCorrect ? (
            <>
              <h2 className="result-correct">Correct!</h2>
              <p>You identified all the target words.</p>
            </>
          ) : (
            <>
              <h2 className="result-wrong">Not quite!</h2>
              <p>You missed some target words or selected wrong ones.</p>
            </>
          )}
          <p className="result-score">Score: {game.score}</p>
          <button className="btn btn-primary" onClick={nextLevel}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
