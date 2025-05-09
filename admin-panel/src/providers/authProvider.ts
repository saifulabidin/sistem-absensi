import { AuthProvider, UserIdentity } from 'react-admin';
import { apiClient } from '@/contexts/AuthContext';

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      // Log the user in
      await apiClient.post('/auth/login', { email: username, password });
      
      // We don't need to store anything in localStorage as we'll use cookies
      // and the AuthContext for state management
      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error.response?.data?.message || 'Login failed');
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      // Clear user data from localStorage
      localStorage.removeItem('user');
      return Promise.resolve();
    } catch (error) {
      console.error('Error during logout:', error);
      return Promise.reject(error);
    }
  },

  checkAuth: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      
      // Check if user is admin
      if (response.data.role !== 'admin') {
        return Promise.reject('Access denied. Admin access only.');
      }
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  },

  checkError: async ({ status }) => {
    if (status === 401 || status === 403) {
      // Clear user data from localStorage
      localStorage.removeItem('user');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return Promise.resolve(response.data.role);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getIdentity: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      const { id, name, email } = response.data;
      
      const identity: UserIdentity = {
        id,
        fullName: name,
        avatar: undefined,
      };
      
      return Promise.resolve(identity);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default authProvider;