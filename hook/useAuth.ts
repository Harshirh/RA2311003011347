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
      // We can't actually push this log to the server yet because we don't have a token,
      // but it's strategically placed for when token tracking changes.
      Log('frontend', 'info', 'hook', 'User successfully registered.');
      return result;
    } catch (err: any) {
      setLoading(false);
      const errorMsg = err.response?.data?.message || err.message || "Registration failed";
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
      
      // Note: In an actual flow, we would want to ensure the token is saved 
      // BEFORE this log executes so the logger has access to the newly minted token.
      Log('frontend', 'info', 'hook', 'User successfully authenticated and token obtained.');
      
      return result;
    } catch (err: any) {
      setLoading(false);
      const errorMsg = err.response?.data?.message || err.message || "Authentication failed";
      setError(errorMsg);
      Log('frontend', 'error', 'hook', `Auth error: ${errorMsg}`);
      throw err;
    }
  };

  return { handleRegister, handleAuth, loading, error };
};
