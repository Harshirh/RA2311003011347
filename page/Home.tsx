"use client";

import React, { useState } from 'react';
import { RegistrationForm } from '../component/RegistrationForm';
import { AuthForm } from '../component/AuthForm';
import { useAuth } from '../hook/useAuth';
import { useAuthStore } from '../state/authStore';
import { Log } from '../api/logger';
import { Container, Typography, Box, Alert, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export const HomePage = () => {
  const router = useRouter();
  const { handleRegister, handleAuth, loading, error } = useAuth();
  const { saveAuthData } = useAuthStore();
  
  const onRegister = async (data: any) => {
    try {
      const regResponse = await handleRegister(data);
      
      const authData = {
        name: data.name,
        email: data.email,
        rollNo: data.rollNo,
        accessCode: data.accessCode,
        clientID: regResponse.clientID,
        clientSecret: regResponse.clientSecret
      };

      const authResponse = await handleAuth(authData);
      
      saveAuthData(authResponse.access_token, authData);
      Log('frontend', 'info', 'page', 'User successfully registered, authenticated, and token is stored.');
      
      router.push('/notification');
    } catch (err) {
      console.error(err);
      Log('frontend', 'warn', 'page', 'User failed registration or authentication step.');
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 6, px: { xs: 2, sm: 4, md: 6 } }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Afford Medical Technologies
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Campus Hiring - Full Stack Track Assessment
        </Typography>
      </Box>

      <Box>
        <RegistrationForm onSubmit={onRegister} loading={loading} error={error} />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button color="primary" onClick={() => router.push('/login')}>
            Already registered? Click here to Login
          </Button>
        </Box>
      </Box>

    </Container>
  );
};
