import { Router } from 'express';
import {
  loginUserController,
  refreshTokensController,
  registerUserController,
} from '../controllers/authController';
const authRouter = Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);
authRouter.post('/refresh', refreshTokensController);
export default authRouter;
