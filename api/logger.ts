import axios from 'axios';
import { API_BASE_URL } from './auth';

/**
 * Valid values constraint based on API specification:
 * Stack: 'frontend' | 'backend'
 * Level: 'info' | 'warn' | 'error' | 'fatal' | 'debug'
 * Package: Any logical component name but must be in lowercase.
 */

type LogStack = 'frontend' | 'backend';
type LogLevel = 'info' | 'warn' | 'error' | 'fatal' | 'debug';

/**
 * Reusable Logging Middleware Function
 * Sends formatted logs to the evaluation server for monitoring application state.
 */
export const Log = async (
  stack: LogStack,
  level: LogLevel,
  pkg: string,
  message: string
) => {
  try {
    // Determine the access token, usually stored in localStorage upon auth
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token') || '';
    }

    if (!token) {
      console.warn("Logger Middleware: Skipping log transmission because no access token was found.");
      return;
    }

    // Payload constraints: must be lower case where applicable
    const logPayload = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message: message
    };

    // Send the log securely to the protected route
    await axios.post(`${API_BASE_URL}/logs`, logPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    // If the logging service is down, fallback to traditional console logging 
    // to prevent losing critical error context during development or production.
    console.error("Logger Middleware: Failed to dispatch log.", error);
  }
};
