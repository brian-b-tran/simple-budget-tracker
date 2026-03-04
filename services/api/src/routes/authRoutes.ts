import { Router } from 'express';
import { registerUserController } from '../controllers/authController';
const authRouter = Router();

authRouter.post('/register', registerUserController);

export default authRouter;
