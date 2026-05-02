import { useState, useEffect } from 'react';

export const useAuthStore = () => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  });
  
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_data');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const saveAuthData = (newToken: string, userData: any) => {
    setToken(newToken);
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', newToken);
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
  };

  const clearAuthData = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
    }
  };

  return { token, user, saveAuthData, clearAuthData };
};
