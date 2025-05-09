'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Create axios instance with credentials
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for cookie-based authentication
  headers: {
    'Content-Type': 'application/json',
  }
});

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/auth/me');
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Not authenticated', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      // Check if user is admin
      if (response.data.user.role !== 'admin') {
        throw new Error('Access denied. Admin access only.');
      }

      // Set user in state
      setUser(response.data.user);
      return;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};