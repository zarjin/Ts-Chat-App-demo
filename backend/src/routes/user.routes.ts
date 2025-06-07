import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getUser, getAllUsers } from '../controllers/user.controllers';

const userRouter = express.Router();

userRouter.get('/get/:userId', authMiddleware, getUser);

userRouter.get('/getall', authMiddleware, getAllUsers);

export default userRouter;
