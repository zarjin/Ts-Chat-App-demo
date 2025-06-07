import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

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

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, loading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <span className="text-gray-600 ml-2">Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-gray-400 text-sm mt-1">Start the conversation by sending a message</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.sender._id === currentUserId;
            const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;
            const showTimestamp = index === messages.length - 1 || 
              messages[index + 1].sender._id !== message.sender._id ||
              new Date(messages[index + 1].createdAt).getTime() - new Date(message.createdAt).getTime() > 300000; // 5 minutes

            return (
              <MessageBubble
                key={message._id}
                message={message}
                isOwnMessage={isOwnMessage}
                showAvatar={showAvatar}
                showTimestamp={showTimestamp}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
