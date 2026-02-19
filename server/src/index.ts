import express from 'express';
import cors from 'cors';
import gameRouter from './routes/game';
import scoresRouter from './routes/scores';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/game', gameRouter);
app.use('/api/scores', scoresRouter);

app.listen(PORT, () => {
  console.log(`ChromaFlash server running on http://localhost:${PORT}`);
});
