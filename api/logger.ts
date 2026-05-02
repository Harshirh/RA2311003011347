import axios from 'axios';
import { API_BASE_URL } from './auth';

type LogStack = 'frontend' | 'backend';
type LogLevel = 'info' | 'warn' | 'error' | 'fatal' | 'debug';

export const Log = async (
  stack: LogStack,
  level: LogLevel,
  pkg: string,
  message: string
) => {
  try {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token') || '';
    }

    if (!token) {
      console.warn("Logger Middleware: Skipping log transmission because no access token was found.");
      return;
    }

    const logPayload = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message: message
    };

    await axios.post(`${API_BASE_URL}/logs`, logPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error("Logger Middleware: Failed to dispatch log.", error);
  }
};
