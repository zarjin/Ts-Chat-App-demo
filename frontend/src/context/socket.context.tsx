import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    email: string;
    profilePic?: string;
  };
  receiver: {
    _id: string;
    fullName: string;
    email: string;
    profilePic?: string;
  };
  message: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  messages: Message[];
  sendMessage: (receiverId: string, message: string, image?: string) => void;
  isConnected: boolean;
  typingUsers: { [key: string]: boolean };
  startTyping: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
  clearMessages: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
  token?: string;
  userId?: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  token,
  userId,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    if (token && userId) {
      // Create socket connection
      const newSocket = io(
        import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
        {
          auth: {
            token: token,
          },
          withCredentials: true,
        }
      );

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      // Online users handler
      newSocket.on('getOnlineUsers', (users: string[]) => {
        setOnlineUsers(users);
      });

      // New message handler
      newSocket.on('newMessage', (message: Message) => {
        setMessages((prev) => {
          // Avoid duplicates
          const exists = prev.find((m) => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      });

      // Message sent confirmation
      newSocket.on('messageSent', (message: Message) => {
        setMessages((prev) => {
          // Avoid duplicates
          const exists = prev.find((m) => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      });

      // Typing indicators
      newSocket.on(
        'userTyping',
        ({
          userId: typingUserId,
          isTyping,
        }: {
          userId: string;
          isTyping: boolean;
        }) => {
          setTypingUsers((prev) => ({
            ...prev,
            [typingUserId]: isTyping,
          }));

          // Clear typing indicator after 3 seconds
          if (isTyping) {
            setTimeout(() => {
              setTypingUsers((prev) => ({
                ...prev,
                [typingUserId]: false,
              }));
            }, 3000);
          }
        }
      );

      // Message read status
      newSocket.on(
        'messageRead',
        ({ messageId, readBy }: { messageId: string; readBy: string }) => {
          console.log(`Message ${messageId} read by ${readBy}`);
          // You can update message read status here if needed
        }
      );

      // Error handler
      newSocket.on('error', (error: any) => {
        console.error('Socket error:', error);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    } else {
      // If no token or userId, disconnect socket
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
        setMessages([]);
        setTypingUsers({});
      }
    }
  }, [token, userId]);

  const sendMessage = (receiverId: string, message: string, image?: string) => {
    if (socket && isConnected) {
      socket.emit('sendMessage', {
        receiverId,
        message,
        image,
      });
    }
  };

  const startTyping = (receiverId: string) => {
    if (socket && isConnected) {
      socket.emit('typing', { receiverId });
    }
  };

  const stopTyping = (receiverId: string) => {
    if (socket && isConnected) {
      socket.emit('stopTyping', { receiverId });
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value: SocketContextType = {
    socket,
    onlineUsers,
    messages,
    sendMessage,
    isConnected,
    typingUsers,
    startTyping,
    stopTyping,
    clearMessages,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
