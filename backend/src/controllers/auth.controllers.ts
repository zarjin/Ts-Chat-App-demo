import { userModel } from '../models/user.models';
import { Request, Response } from 'express';
import { hashPassword, comparePassword } from '../utils/bcrypt.utils';
import { generateToken } from '../utils/jwt.utils';

export const Register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res
        .status(409)
        .json({ message: 'An account with this email already exists.' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      profilePic: req.file?.path || '',
    });

    const token = generateToken(newUser._id as string);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const Login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const token = generateToken(user._id as string);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.status(200).json({
      message: 'User logged in successfully.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const Logout = (_req: Request, res: Response): void => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
