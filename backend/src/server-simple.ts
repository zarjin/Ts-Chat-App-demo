import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import { connectDB } from './configs/connectdb.config';
import authRouter from './routes/auth.routes';
import messageRouter from './routes/message.routes';
import userRouter from './routes/user.routes';

const app = express();

connectDB();

// CORS configuration for Express
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send('Hello World - Chat App (Simple Version)');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Note: This is the simple version without Socket.IO`);
  console.log(`To enable real-time features, install socket.io and use server.ts`);
});
