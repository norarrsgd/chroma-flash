import { useState, useCallback } from 'react';
import { GameState, GamePhase, LevelConfig } from '../types';
import { generateRound } from '../services/api';

const initialState: GameState = {
  phase: 'start',
  playerName: '',
  level: 1,
  score: 0,
  lives: 3,
  words: [],
  targetIndices: [],
  selectedAnswers: [],
  roundCorrect: null,
};

export function getLevelConfig(level: number): LevelConfig {
  if (level <= 3) return { wordCount: 15, targetWords: 1, flashSpeed: 700 };
  if (level <= 6) return { wordCount: 25, targetWords: level <= 4 ? 1 : 2, flashSpeed: 550 };
  if (level <= 9) return { wordCount: 35, targetWords: 2, flashSpeed: 450 };
  if (level <= 12) return { wordCount: 45, targetWords: 2, flashSpeed: 350 };
  if (level <= 15) return { wordCount: 55, targetWords: level <= 13 ? 2 : 3, flashSpeed: 275 };
  return { wordCount: 65, targetWords: 3, flashSpeed: 200 };
}

export function useGame() {
  const [game, setGame] = useState<GameState>(initialState);
  const [loading, setLoading] = useState(false);

  const fetchAndStartRound = useCallback(async (level: number, name?: string) => {
    setLoading(true);
    try {
      const data = await generateRound(level);
      setGame((prev) => ({
        ...prev,
        ...(name !== undefined ? { playerName: name, lives: 3, score: 0 } : {}),
        level,
        words: data.words,
        targetIndices: data.targetIndices,
        selectedAnswers: [],
        roundCorrect: null,
        phase: 'flashing' as GamePhase,
      }));
    } catch (err) {
      console.error('Failed to start round:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const startGame = useCallback(
    async (name: string) => {
      await fetchAndStartRound(1, name);
    },
    [fetchAndStartRound]
  );

  const onFlashComplete = useCallback(() => {
    setGame((prev) => ({ ...prev, phase: 'answering' }));
  }, []);

  const submitAnswers = useCallback((selected: number[]) => {
    setGame((prev) => {
      const targetSet = new Set(prev.targetIndices);

      const correctCount = selected.filter((i) => targetSet.has(i)).length;
      const wrongCount = selected.filter((i) => !targetSet.has(i)).length;
      const allCorrect = correctCount === targetSet.size && wrongCount === 0;

      const multiplier = 1 + (prev.level - 1) * 0.5;
      let points = correctCount * 100 * multiplier;
      if (allCorrect) points += 50;

      const lostLife = wrongCount > 0 || correctCount < targetSet.size;
      const newLives = lostLife ? prev.lives - 1 : prev.lives;

      return {
        ...prev,
        selectedAnswers: selected,
        roundCorrect: allCorrect,
        score: prev.score + Math.round(points),
        lives: newLives,
        phase: newLives <= 0 ? 'gameover' : 'result',
      };
    });
  }, []);

  const nextLevel = useCallback(async () => {
    const newLevel = game.level + 1;
    await fetchAndStartRound(newLevel);
  }, [game.level, fetchAndStartRound]);

  const resetGame = useCallback(() => {
    setGame(initialState);
  }, []);

  return {
    game,
    loading,
    startGame,
    onFlashComplete,
    submitAnswers,
    nextLevel,
    resetGame,
  };
}
