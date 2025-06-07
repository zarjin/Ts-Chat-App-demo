import React from 'react';

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

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar: boolean;
  showTimestamp: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showAvatar,
  showTimestamp
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {/* Avatar */}
        <div className={`w-8 h-8 ${showAvatar ? 'visible' : 'invisible'}`}>
          {!isOwnMessage && (
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden">
              {message.sender.profilePic ? (
                <img 
                  src={message.sender.profilePic} 
                  alt={message.sender.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-xs">
                  {message.sender.fullName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Message content */}
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          {/* Sender name (only for received messages and when showing avatar) */}
          {!isOwnMessage && showAvatar && (
            <span className="text-xs text-gray-600 mb-1 px-2">
              {message.sender.fullName}
            </span>
          )}

          {/* Message bubble */}
          <div
            className={`
              relative px-4 py-2 rounded-2xl max-w-full break-words
              ${isOwnMessage
                ? 'bg-blue-500 text-white rounded-br-md'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
              }
            `}
          >
            {/* Image if present */}
            {message.image && (
              <div className="mb-2">
                <img 
                  src={message.image} 
                  alt="Shared image"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}

            {/* Text message */}
            {message.message && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            )}

            {/* Message tail */}
            <div
              className={`
                absolute bottom-0 w-3 h-3
                ${isOwnMessage
                  ? 'right-0 transform translate-x-1 translate-y-1'
                  : 'left-0 transform -translate-x-1 translate-y-1'
                }
              `}
            >
              <div
                className={`
                  w-full h-full transform rotate-45
                  ${isOwnMessage
                    ? 'bg-blue-500'
                    : 'bg-white border-r border-b border-gray-200'
                  }
                `}
              ></div>
            </div>
          </div>

          {/* Timestamp */}
          {showTimestamp && (
            <span className={`text-xs text-gray-500 mt-1 px-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
              {formatTime(message.createdAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
