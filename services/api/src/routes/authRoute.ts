import { Router } from 'express';
import {
  loginUserController,
  logoutAllUserController,
  logoutUserController,
  meController,
  refreshTokensController,
  registerUserController,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
const authRouter = Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);
authRouter.post('/refresh', refreshTokensController);
authRouter.post('/logout', logoutUserController);
authRouter.post('/logout-all', logoutAllUserController);
authRouter.get('/me', authMiddleware, meController);
export default authRouter;
