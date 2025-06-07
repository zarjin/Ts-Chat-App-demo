import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { Register, Login, Logout } from '../controllers/auth.controllers';
import { profileUpload } from '../middlewares/multer.middleware';
const authRouter: Router = Router();

// Register route with validation
authRouter.post('/register', profileUpload.single('profilePic'), Register);

// Login route with validation
authRouter.post('/login', Login);

// Logout route with auth middleware
authRouter.post('/logout', authMiddleware, Logout);

export default authRouter;
