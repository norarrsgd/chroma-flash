import { Router, Request, Response } from 'express';
import { generateText } from '../services/ollama';

const router = Router();

function getWordCount(level: number): number {
  if (level <= 3) return 20;
  if (level <= 6) return 30;
  if (level <= 9) return 40;
  if (level <= 12) return 50;
  if (level <= 15) return 60;
  return 70;
}

function getTargetCount(level: number): number {
  if (level <= 3) return 1;
  if (level <= 6) return Math.random() < 0.5 ? 1 : 2;
  if (level <= 9) return 2;
  if (level <= 12) return 2;
  if (level <= 15) return Math.random() < 0.5 ? 2 : 3;
  return 3;
}

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { level } = req.body;

    if (!level || typeof level !== 'number' || level < 1) {
      res.status(400).json({ error: 'Invalid level' });
      return;
    }

    const wordCount = getWordCount(level);
    const targetCount = getTargetCount(level);

    let words = await generateText(wordCount);

    // Pad or truncate to exact word count
    if (words.length < wordCount) {
      const filler = [
        'the', 'and', 'but', 'with', 'from', 'this', 'that', 'have',
        'been', 'were', 'more', 'when', 'will', 'each', 'make', 'like',
        'long', 'look', 'many', 'some', 'them', 'than', 'call', 'first',
        'could', 'people', 'water', 'other', 'about', 'which', 'their',
      ];
      while (words.length < wordCount) {
        words.push(filler[Math.floor(Math.random() * filler.length)]);
      }
    } else if (words.length > wordCount) {
      words = words.slice(0, wordCount);
    }

    // Select random unique target indices (avoid first/last 2 words)
    const minIdx = 2;
    const maxIdx = words.length - 3;
    const targetIndices: number[] = [];

    while (targetIndices.length < targetCount) {
      const idx = Math.floor(Math.random() * (maxIdx - minIdx + 1)) + minIdx;
      if (!targetIndices.includes(idx)) {
        targetIndices.push(idx);
      }
    }

    targetIndices.sort((a, b) => a - b);

    res.json({ words, targetIndices });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Failed to generate round' });
  }
});

export default router;
