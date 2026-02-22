import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface Props {
  words: string[];
  targetIndices: number[];
  onSubmit: (selectedIndices: number[], timedOut?: boolean) => void;
  timeLimit: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AnswerSelect({ words, targetIndices, onSubmit, timeLimit }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const submittedRef = useRef(false);
  const selectedRef = useRef<Set<number>>(new Set());

  // Keep selectedRef in sync
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const handleSubmit = useCallback((timedOut = false) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onSubmit(Array.from(selectedRef.current), timedOut);
  }, [onSubmit]);

  // Countdown timer
  useEffect(() => {
    submittedRef.current = false;
    setTimeLeft(timeLimit);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-submit on next tick to avoid state update during render
          setTimeout(() => handleSubmit(true), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, handleSubmit]);

  const options = useMemo(() => {
    const targetSet = new Set(targetIndices);
    const targets = targetIndices.map((i) => ({ word: words[i], index: i }));

    const nonTargets: { word: string; index: number }[] = [];
    for (let i = 0; i < words.length; i++) {
      if (!targetSet.has(i)) {
        nonTargets.push({ word: words[i], index: i });
      }
    }

    const decoyCount = Math.max(0, 6 - targets.length);
    const shuffledNonTargets = shuffle(nonTargets);
    const decoys = shuffledNonTargets.slice(0, decoyCount);

    return shuffle([...targets, ...decoys]);
  }, [words, targetIndices]);

  const toggleSelection = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const progress = timeLeft / timeLimit;
  const isUrgent = timeLeft < 3;

  return (
    <div className="answer-select">
      <div className="answer-timer">
        <span className={`answer-timer-text ${isUrgent ? 'answer-timer-urgent' : ''}`}>
          {timeLeft}s
        </span>
        <div className="answer-timer-bar-track">
          <div
            className={`answer-timer-bar-fill ${isUrgent ? 'answer-timer-bar-urgent' : ''}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      <h2 className="answer-title">Which words were highlighted?</h2>
      <p className="answer-hint">
        Select the {targetIndices.length} word{targetIndices.length > 1 ? 's' : ''} that appeared in gold
      </p>
      <div className="answer-grid">
        {options.map((opt) => (
          <button
            key={opt.index}
            className={`answer-option ${selected.has(opt.index) ? 'answer-selected' : ''}`}
            onClick={() => toggleSelection(opt.index)}
          >
            {opt.word}
          </button>
        ))}
      </div>
      <button
        className="btn btn-primary"
        onClick={() => handleSubmit()}
        disabled={selected.size === 0}
      >
        Submit Answer
      </button>
    </div>
  );
}
