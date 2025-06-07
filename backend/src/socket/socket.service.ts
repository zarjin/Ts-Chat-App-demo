import { Server } from 'socket.io';

let io: Server | null = null;

export const setSocketIO = (socketIO: Server) => {
  io = socketIO;
};

export const getSocketIO = (): Server | null => {
  return io;
};

export const emitToUser = (userId: string, event: string, data: any) => {
  if (!io) return;
  
  // This would require importing the onlineUsers from socket.handlers
  // For now, we'll emit to all connected clients with the userId
  io.emit(`${event}_${userId}`, data);
};

export const emitToAll = (event: string, data: any) => {
  if (!io) return;
  io.emit(event, data);
};
