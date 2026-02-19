import { useState, useEffect, useCallback, useRef } from 'react';

interface Props {
  words: string[];
  targetIndices: number[];
  flashSpeed: number;
  onComplete: () => void;
}

function getORPIndex(word: string): number {
  if (word.length <= 1) return 0;
  if (word.length <= 3) return 1;
  return Math.floor(word.length / 3);
}

export default function WordFlash({ words, targetIndices, flashSpeed, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const beforeRef = useRef<HTMLSpanElement>(null);
  const orpRef = useRef<HTMLSpanElement>(null);
  const [orpOffset, setOrpOffset] = useState(0);

  const targetSet = new Set(targetIndices);

  const advance = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= words.length) {
        setTimeout(onComplete, 100);
        return prev;
      }
      return next;
    });
  }, [words.length, onComplete]);

  useEffect(() => {
    setCurrentIndex(0);
    setVisible(true);
  }, []);

  // Measure and position the ORP letter at center
  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= words.length) return;

    // Measure after render
    requestAnimationFrame(() => {
      const beforeEl = beforeRef.current;
      const orpEl = orpRef.current;
      if (beforeEl && orpEl) {
        const beforeWidth = beforeEl.getBoundingClientRect().width;
        const orpWidth = orpEl.getBoundingClientRect().width;
        // Shift left by: (width of before chars) + (half of ORP char)
        setOrpOffset(beforeWidth + orpWidth / 2);
      }
    });
  }, [currentIndex, words.length]);

  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= words.length) return;

    setVisible(true);

    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
    }, flashSpeed * 0.75);

    const advanceTimer = setTimeout(() => {
      advance();
    }, flashSpeed);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(advanceTimer);
    };
  }, [currentIndex, flashSpeed, words.length, advance]);

  if (currentIndex < 0 || currentIndex >= words.length) {
    return <div className="word-flash-container" />;
  }

  const word = words[currentIndex];
  const isTarget = targetSet.has(currentIndex);
  const orpIndex = getORPIndex(word);

  const before = word.slice(0, orpIndex);
  const orpChar = word[orpIndex];
  const after = word.slice(orpIndex + 1);

  const orpClass = isTarget ? 'orp-letter-target' : 'orp-letter-normal';

  return (
    <div className="word-flash-container">
      <div className="word-flash-guide">
        <div className="guide-line" />
      </div>
      <div
        className={`word-display ${visible ? 'word-visible' : 'word-hidden'}`}
        style={{ transform: `translateX(-${orpOffset}px)` }}
      >
        <span className="word-before" ref={beforeRef}>{before}</span>
        <span className={`orp-letter ${orpClass}`} ref={orpRef}>{orpChar}</span>
        <span className="word-after">{after}</span>
      </div>
      <div className="word-progress">
        {currentIndex + 1} / {words.length}
      </div>
    </div>
  );
}
