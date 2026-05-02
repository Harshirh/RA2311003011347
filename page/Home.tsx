"use client";

import React, { useState } from 'react';
import { RegistrationForm } from '../component/RegistrationForm';
import { AuthForm } from '../component/AuthForm';
import { useAuth } from '../hook/useAuth';
import { useAuthStore } from '../state/authStore';
import { Log } from '../api/logger';
import { Container, Typography, Box, Alert, Paper, Stepper, Step, StepLabel } from '@mui/material';

export const HomePage = () => {
  const { handleRegister, handleAuth, loading, error } = useAuth();
  const { saveAuthData } = useAuthStore();
  
  const [step, setStep] = useState(0);
  const [regData, setRegData] = useState<any>(null);
  const [tokenData, setTokenData] = useState<any>(null);

  const onRegister = async (data: any) => {
    try {
      const response = await handleRegister(data);
      // Registration API response includes clientID and clientSecret, along with original data
      setRegData(response);
      setStep(1); // Move to auth step
    } catch (err) {
      console.error(err);
    }
  };

  const onAuth = async (data: any) => {
    try {
      const response = await handleAuth(data);
      setTokenData(response);
      // VERY IMPORTANT: save auth data first so the logger has access to the token in localStorage
      saveAuthData(response.access_token, data);
      
      // Now that the token is secured, we can securely log to the API
      Log('frontend', 'info', 'page', 'User reached success state and token is stored.');
      
      setStep(2); // Success step
    } catch (err) {
      console.error(err);
      // At this point we might not have a token if it's the first time they are failing auth,
      // but if we do, this will log the failure.
      Log('frontend', 'warn', 'page', 'User failed authentication step.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Afford Medical Technologies
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Campus Hiring - Full Stack Track Assessment
        </Typography>
      </Box>

      <Stepper activeStep={step} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Register</StepLabel>
        </Step>
        <Step>
          <StepLabel>Authenticate</StepLabel>
        </Step>
        <Step>
          <StepLabel>Success</StepLabel>
        </Step>
      </Stepper>

      {step === 0 && (
        <RegistrationForm onSubmit={onRegister} loading={loading} error={error} />
      )}

      {step === 1 && (
        <AuthForm 
          onSubmit={onAuth} 
          loading={loading} 
          error={error} 
          initialData={regData} 
        />
      )}

      {step === 2 && tokenData && (
        <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', mt: 4 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Authentication Successful! You have obtained your authorization token.
          </Alert>
          <Box sx={{ bgcolor: 'grey.100', p: 3, borderRadius: 2, textAlign: 'left', overflowWrap: 'break-word' }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Access Token ({tokenData.token_type}):
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {tokenData.access_token}
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
};
