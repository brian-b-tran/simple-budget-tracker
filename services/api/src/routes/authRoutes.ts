import { Router } from 'express';
import {
  loginUserController,
  logoutAllUserController,
  logoutUserController,
  refreshTokensController,
  registerUserController,
} from '../controllers/authController';
const authRouter = Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);
authRouter.post('/refresh', refreshTokensController);
authRouter.post('/logout', logoutUserController);
authRouter.post('/logout-all', logoutAllUserController);
export default authRouter;
