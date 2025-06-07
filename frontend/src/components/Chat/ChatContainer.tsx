import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/socket.context';
import { useAuth } from '../../context/auth.context';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import axios from 'axios';

interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

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

interface ChatContainerProps {
  currentUser: User;
  token: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  currentUser,
  token,
}) => {
  const {
    sendMessage,
    isConnected,
    onlineUsers,
    typingUsers,
    messages,
    clearMessages,
  } = useSocket();
  const { logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
          }/api/user/getall`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setUsers(
          response.data.filter((user: User) => user._id !== currentUser._id)
        );
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentUser._id, token]);

  // Fetch messages when a user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
          }/api/message/get/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setChatMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, token]);

  const handleSendMessage = async (message: string, image?: string) => {
    if (!selectedUser) return;

    console.log('Sending message via Socket.IO:', {
      message,
      selectedUser: selectedUser._id,
      isConnected,
    });

    // Send message via Socket.IO for real-time delivery
    sendMessage(selectedUser._id, message, image);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setChatMessages([]); // Clear local messages when switching conversations
    clearMessages(); // Clear Socket.IO messages
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with user list */}
      <div className="w-1/3 bg-white border-r border-gray-300">
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                {currentUser.profilePic ? (
                  <img
                    src={currentUser.profilePic}
                    alt={currentUser.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">
                  {currentUser.fullName}
                </h2>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {isConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
              title="Logout"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>

        <UserList
          users={users}
          onlineUsers={onlineUsers}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          currentUserId={currentUser._id}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 bg-white border-b border-gray-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                  {selectedUser.profilePic ? (
                    <img
                      src={selectedUser.profilePic}
                      alt={selectedUser.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold">
                      {selectedUser.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedUser.fullName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        onlineUsers.includes(selectedUser._id)
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      }`}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {onlineUsers.includes(selectedUser._id)
                        ? 'Online'
                        : 'Offline'}
                    </span>
                    {typingUsers[selectedUser._id] && (
                      <span className="text-sm text-blue-600 italic">
                        typing...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <MessageList
              messages={[...chatMessages, ...messages]}
              currentUserId={currentUser._id}
              loading={loading}
            />

            {/* Message input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={!isConnected}
              receiverId={selectedUser._id}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to Chat
              </h3>
              <p className="text-gray-500">
                Select a user from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
