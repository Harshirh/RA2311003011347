import { useState } from 'react';

// Basic state wrapper for auth data
export const useAuthStore = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const saveAuthData = (newToken: string, userData: any) => {
    setToken(newToken);
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', newToken);
    }
  };

  const clearAuthData = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  };

  return { token, user, saveAuthData, clearAuthData };
};
