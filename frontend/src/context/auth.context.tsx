import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';

interface User {
  id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  profilePic?: File;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = serverUrl;
  }, [serverUrl]);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user info from a protected endpoint
        // For now, we'll simulate this with localStorage
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (data: RegisterData) => {
    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (data.profilePic) {
        formData.append('profilePic', data.profilePic);
      }

      const response = await axios.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { user: userData, token: userToken } = response.data;
      const userObj = {
        id: userData.id,
        fullName: userData.fullName,
        email: userData.email,
        profilePic: userData.profilePic,
      };

      setUser(userObj);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('token', userToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const login = async (data: LoginData) => {
    try {
      const response = await axios.post('/api/auth/login', data);
      const { user: userData, token: userToken } = response.data;

      const userObj = {
        id: userData.id,
        fullName: userData.fullName,
        email: userData.email,
        profilePic: userData.profilePic,
      };

      setUser(userObj);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('token', userToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
