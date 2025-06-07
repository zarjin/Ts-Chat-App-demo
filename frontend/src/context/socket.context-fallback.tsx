import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  socket: null;
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
  userId 
}) => {
  const [onlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers] = useState<{ [key: string]: boolean }>({});

  // Fallback implementation - no real-time features
  const sendMessage = (receiverId: string, message: string, image?: string) => {
    console.log('Fallback: sendMessage called', { receiverId, message, image });
    // In a real implementation, this would make an HTTP request to send the message
    // For now, we'll just log it
  };

  const startTyping = (receiverId: string) => {
    console.log('Fallback: startTyping called', { receiverId });
    // No-op in fallback mode
  };

  const stopTyping = (receiverId: string) => {
    console.log('Fallback: stopTyping called', { receiverId });
    // No-op in fallback mode
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value: SocketContextType = {
    socket: null,
    onlineUsers,
    messages,
    sendMessage,
    isConnected: false, // Always false in fallback mode
    typingUsers,
    startTyping,
    stopTyping,
    clearMessages
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
