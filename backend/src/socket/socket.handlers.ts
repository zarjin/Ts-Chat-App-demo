import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt.utils';
import { messageModel } from '../models/message.models';
import { userModel } from '../models/user.models';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

interface OnlineUser {
  userId: string;
  socketId: string;
}

// Store online users
const onlineUsers: OnlineUser[] = [];

// Helper function to add user to online users
const addUser = (userId: string, socketId: string) => {
  const existingUser = onlineUsers.find(user => user.userId === userId);
  if (existingUser) {
    existingUser.socketId = socketId;
  } else {
    onlineUsers.push({ userId, socketId });
  }
};

// Helper function to remove user from online users
const removeUser = (socketId: string) => {
  const index = onlineUsers.findIndex(user => user.socketId === socketId);
  if (index !== -1) {
    onlineUsers.splice(index, 1);
  }
};

// Helper function to get user by userId
const getUser = (userId: string) => {
  return onlineUsers.find(user => user.userId === userId);
};

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware for socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return next(new Error('Authentication error: Invalid token'));
      }

      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error: ' + (error as Error).message));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected with socket ID: ${socket.id}`);

    // Add user to online users
    if (socket.userId) {
      addUser(socket.userId, socket.id);
      
      // Emit online users to all clients
      io.emit('getOnlineUsers', onlineUsers.map(user => user.userId));
    }

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId, message, image } = data;
        const senderId = socket.userId;

        if (!senderId || !receiverId || !message) {
          socket.emit('error', { message: 'Missing required fields' });
          return;
        }

        // Save message to database
        const newMessage = await messageModel.create({
          sender: senderId,
          receiver: receiverId,
          message,
          image: image || '',
        });

        // Populate sender and receiver information
        const populatedMessage = await messageModel
          .findById(newMessage._id)
          .populate('sender', 'fullName email profilePic')
          .populate('receiver', 'fullName email profilePic');

        // Send message to receiver if online
        const receiverUser = getUser(receiverId);
        if (receiverUser) {
          io.to(receiverUser.socketId).emit('newMessage', populatedMessage);
        }

        // Send confirmation to sender
        socket.emit('messageSent', populatedMessage);

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { receiverId } = data;
      const receiverUser = getUser(receiverId);
      if (receiverUser) {
        io.to(receiverUser.socketId).emit('userTyping', {
          userId: socket.userId,
          isTyping: true
        });
      }
    });

    socket.on('stopTyping', (data) => {
      const { receiverId } = data;
      const receiverUser = getUser(receiverId);
      if (receiverUser) {
        io.to(receiverUser.socketId).emit('userTyping', {
          userId: socket.userId,
          isTyping: false
        });
      }
    });

    // Handle message read status
    socket.on('markAsRead', async (data) => {
      try {
        const { messageId, senderId } = data;
        
        // You can implement read status in your message model if needed
        // For now, just emit to sender that message was read
        const senderUser = getUser(senderId);
        if (senderUser) {
          io.to(senderUser.socketId).emit('messageRead', {
            messageId,
            readBy: socket.userId
          });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
      removeUser(socket.id);
      
      // Emit updated online users to all clients
      io.emit('getOnlineUsers', onlineUsers.map(user => user.userId));
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};

export { onlineUsers };
