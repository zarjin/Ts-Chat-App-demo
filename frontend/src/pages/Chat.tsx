import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/auth.context';
import { SocketProvider } from '../context/socket.context';
import ChatContainer from '../components/Chat/ChatContainer';
import AuthDebug from '../components/Debug/AuthDebug';

const Chat: React.FC = () => {
  const { user, token, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Convert user format for ChatContainer
  const currentUser = {
    _id: user.id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
  };

  return (
    <SocketProvider token={token} userId={user.id}>
      <div className="h-screen">
        <ChatContainer currentUser={currentUser} token={token} />
        <AuthDebug />
      </div>
    </SocketProvider>
  );
};

export default Chat;
