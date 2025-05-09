import { useContext } from 'react';
import { AuthContext } from './AuthContextProvider';

export const useAuthentication = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthentication must be used within an AuthContextProvider');
  }
  
  return context;
};
