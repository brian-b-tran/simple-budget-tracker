import { env } from './config/env';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import healthRouter from './routes/healthRoutes';
import authRouter from './routes/authRoutes';
import expenseRouter from './routes/expenseRoutes';
import prisma from './config/db';
import categoryRouter from './routes/categoryRoute';
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/category', categoryRouter);
app.use('/expense', expenseRouter);

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
