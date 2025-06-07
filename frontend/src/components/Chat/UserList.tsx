import React from 'react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

interface UserListProps {
  users: User[];
  onlineUsers: string[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
  currentUserId: string;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onlineUsers,
  selectedUser,
  onUserSelect,
  currentUserId
}) => {
  return (
    <div className="overflow-y-auto h-full">
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Contacts ({users.length})
        </h3>
        
        <div className="space-y-1">
          {users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;
            
            return (
              <div
                key={user._id}
                onClick={() => onUserSelect(user)}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200
                  ${isSelected 
                    ? 'bg-blue-100 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-100'
                  }
                `}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden">
                    {user.profilePic ? (
                      <img 
                        src={user.profilePic} 
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-lg">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {/* Online indicator */}
                  <div className={`
                    absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                    ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
                  `}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`
                      font-medium truncate
                      ${isSelected ? 'text-blue-700' : 'text-gray-900'}
                    `}>
                      {user.fullName}
                    </h4>
                    
                    {isOnline && (
                      <span className="text-xs text-green-600 font-medium">
                        Online
                      </span>
                    )}
                  </div>
                  
                  <p className={`
                    text-sm truncate
                    ${isSelected ? 'text-blue-600' : 'text-gray-500'}
                  `}>
                    {user.email}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
