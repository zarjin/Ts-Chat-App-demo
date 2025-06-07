import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { sendMessage, getMessage } from '../controllers/message.controllers';
import { messageUpload } from '../middlewares/multer.middleware';

const messageRouter = express.Router();

messageRouter.post(
  '/send/:receiverId',
  authMiddleware,
  messageUpload.single('image'),
  sendMessage
);

messageRouter.get('/get/:receiverId', authMiddleware, getMessage);

export default messageRouter;
