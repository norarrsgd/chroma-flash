import { Router, Request, Response } from 'express';
import { getTopScores, saveScore } from '../services/database';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  try {
    const scores = getTopScores(20);
    res.json(scores);
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { playerName, score, levelReached } = req.body;

    if (!playerName || typeof playerName !== 'string') {
      res.status(400).json({ error: 'Invalid playerName' });
      return;
    }
    if (typeof score !== 'number' || score < 0) {
      res.status(400).json({ error: 'Invalid score' });
      return;
    }
    if (typeof levelReached !== 'number' || levelReached < 1) {
      res.status(400).json({ error: 'Invalid levelReached' });
      return;
    }

    saveScore(playerName, score, levelReached);
    res.json({ success: true });
  } catch (error) {
    console.error('Save score error:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

export default router;
