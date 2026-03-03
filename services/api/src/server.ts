import { env } from './config/env';
import express, { Request, Response } from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes';
import prisma from './config/db';
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

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    app.listen(env.PORT, () => {
      console.log(`API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
