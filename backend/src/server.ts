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

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is running http://localhost:${PORT}`);
});
