import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary.config';
import multer from 'multer';

const userProfileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => ({
    folder: 'chatUserProfile',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  }),
});

const messageImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => ({
    folder: 'chatUserProfile',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  }),
});

export const profileUplaod = multer({ storage: userProfileStorage });
export const messageUpload = multer({ storage: messageImageStorage });
