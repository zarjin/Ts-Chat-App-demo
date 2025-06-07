import { Request, Response } from 'express';
import { userModel } from '../models/user.models';

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: 'User ID required' });
      return;
    }

    const user = await userModel.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: `User retrieval error: ${(error as Error).message}`,
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userModel.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: `Users retrieval error: ${(error as Error).message}`,
    });
  }
};
