import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    (req as any).user = decoded;

    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
