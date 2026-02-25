import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { env } from './env';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Expense Tracker API is running.' });
});

app.listen(env.PORT, () => {
  console.log(`API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
