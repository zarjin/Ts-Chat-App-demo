import { messageModel } from '../models/message.models';
import { Request, Response } from 'express';

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const senderId = (req as any).user.id;
    const { receiverId } = req.params;

    const { message } = req.body;

    if (!senderId || !receiverId) {
      res.status(400).json({ message: 'User ID required' });
      return;
    }

    const newMessage = await messageModel.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image: req.file?.path || '',
    });

    res.status(200).json(newMessage);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Message sending error: ${(error as Error).message}` });
  }
};

export const getMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const senderId = (req as any).user.id;
    const { receiverId } = req.params;

    if (!senderId || !receiverId) {
      res.status(400).json({ message: 'User ID required' });
      return;
    }

    const messages = await messageModel
      .find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      })
      .sort({ createdAt: 1 }); // Assuming you want them in order

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: `Message retrieval error: ${(error as Error).message}`,
    });
  }
};
