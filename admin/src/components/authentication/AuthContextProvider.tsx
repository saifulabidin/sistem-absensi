import React, { useState, useEffect, createContext, useContext } from 'react';
import authService from '../../services/auth.service';
import { User } from '../../services/auth.service';

type AuthContextProps = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

type AuthContextProviderProps = {
  children: React.ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user profile
      authService.getUserProfile()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          // Invalid token, clear it
          authService.logout();
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      });
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuthentication = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthentication must be used within an AuthContextProvider');
  }
  return context;
};
