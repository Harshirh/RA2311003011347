"use client";

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';

interface RegistrationFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    rollNo: '',
    accessCode: '',
    mobileNo: '',
    githubUsername: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, margin: '0 auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Registration
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Roll Number"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Access Code"
            name="accessCode"
            value={formData.accessCode}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Mobile Number"
            name="mobileNo"
            type="tel"
            value={formData.mobileNo}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="GitHub Username"
            name="githubUsername"
            value={formData.githubUsername}
            onChange={handleChange}
            required
            fullWidth
            helperText="Provide only the username, not the full URL"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
