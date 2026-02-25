import { env } from './config/env';
import express, { Request, Response } from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes';
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/health', healthRoutes);
app.use('/', async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Expense API.' });
});
//start
app.listen(env.PORT, () => {
  console.log(`API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
