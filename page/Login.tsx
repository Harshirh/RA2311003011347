"use client";

import React, { useState } from 'react';
import { Log } from '../api/logger';
import { Container, Typography, Box, Alert, Paper, Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { authenticateUser } from '../api/auth';

export const LoginPage = () => {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const storedUserData = localStorage.getItem('user_data');

    if (!storedUserData) {
      setError('No registered account found locally. Please register first.');
      setLoading(false);
      return;
    }

    const userData = JSON.parse(storedUserData);

    if (userData.email && userData.email.toLowerCase() === email.toLowerCase()) {
      try {
        const response = await authenticateUser(userData);
        localStorage.setItem('access_token', response.access_token);
        setSuccess(true);
        Log('frontend', 'info', 'page', `User successfully logged in with email: ${email} and received fresh token`);
        router.push('/notification');
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Authentication failed';
        setError(`Failed to fetch fresh token: ${errorMsg}`);
        Log('frontend', 'error', 'page', `Failed to fetch fresh token for email: ${email}`);
      }
    } else {
      setError('No registered account found with this email ID.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth={false} sx={{ py: 6, px: { xs: 2, sm: 4, md: 6 } }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          Login to your Account
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Enter your registered Email ID to access your Notifications
        </Typography>
      </Box>

      {!success ? (
        <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          <form onSubmit={handleEmailLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Registered Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                disabled={loading || !email}
              >
                {loading ? 'Verifying...' : 'Login'}
              </Button>
            </Box>
          </form>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button color="primary" onClick={() => router.push('/')}>
              Don't have an account? Register here
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', mt: 4 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Login Successful! Redirecting...
          </Alert>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={() => router.push('/notification')}
          >
            Go to Priority Inbox Manually
          </Button>
        </Paper>
      )}
    </Container>
  );
};
