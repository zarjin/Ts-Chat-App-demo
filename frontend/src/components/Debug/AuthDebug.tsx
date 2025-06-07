import React from 'react';
import { useAuth } from '../../context/auth.context';

const AuthDebug: React.FC = () => {
  const { user, token, isAuthenticated, loading } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>Has Token: {token ? 'Yes' : 'No'}</div>
        <div>Token Length: {token ? token.length : 0}</div>
        <div>User ID: {user?.id || 'None'}</div>
        <div>User Name: {user?.fullName || 'None'}</div>
        <div>User Email: {user?.email || 'None'}</div>
      </div>
    </div>
  );
};

export default AuthDebug;
