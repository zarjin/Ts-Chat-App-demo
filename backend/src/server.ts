import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectDB } from './configs/connectdb.config';
import authRouter from './routes/auth.routes';
import messageRouter from './routes/message.routes';
import userRouter from './routes/user.routes';
import { setupSocketHandlers } from './socket/socket.handlers';
import { setSocketIO } from './socket/socket.service';

const app = express();
const server = createServer(app);

// Socket.IO setup with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

connectDB();

// CORS configuration for Express
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Socket.IO handlers
setSocketIO(io);
setupSocketHandlers(io);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send('Hello World - Chat App with Socket.IO');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Socket.IO is ready for connections`);
});
