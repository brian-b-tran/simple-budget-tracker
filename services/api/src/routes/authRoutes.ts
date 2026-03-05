import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshTokensController,
  registerUserController,
} from '../controllers/authController';
const authRouter = Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);
authRouter.post('/refresh', refreshTokensController);
authRouter.post('/logout', logoutUserController);
export default authRouter;
