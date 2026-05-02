import { useState } from 'react';
import { registerUser, authenticateUser } from '../api/auth';
import { Log } from '../api/logger';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerUser(data);
      setLoading(false);
      Log('frontend', 'info', 'hook', 'User successfully registered.');
      return result;
    } catch (err: any) {
      setLoading(false);
      
      let errorMsg = "Registration failed";
      if (err.response?.data) {
        if (err.response.data.message) errorMsg = err.response.data.message;
        else if (err.response.data.errors) errorMsg = JSON.stringify(err.response.data.errors);
        else if (typeof err.response.data === 'string') errorMsg = err.response.data;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      Log('frontend', 'error', 'hook', `Registration error: ${errorMsg}`);
      throw err;
    }
  };

  const handleAuth = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticateUser(data);
      setLoading(false);
      Log('frontend', 'info', 'hook', 'User successfully authenticated and token obtained.');
      return result;
    } catch (err: any) {
      setLoading(false);
      
      let errorMsg = "Authentication failed";
      if (err.response?.data) {
        if (err.response.data.message) errorMsg = err.response.data.message;
        else if (err.response.data.errors) errorMsg = JSON.stringify(err.response.data.errors);
        else if (typeof err.response.data === 'string') errorMsg = err.response.data;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      Log('frontend', 'error', 'hook', `Auth error: ${errorMsg}`);
      throw err;
    }
  };

  return { handleRegister, handleAuth, loading, error };
};
