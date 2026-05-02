"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Paper, Chip, Stack, CircularProgress, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useAuthStore } from '../../state/authStore';
import { Log } from '../../api/logger';
import { TopKNotifications, AppNotification } from '../../utils/priorityQueue';
import { API_BASE_URL } from '../../api/auth';

export default function NotificationPage() {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allNotifications, setAllNotifications] = useState<AppNotification[]>([]);
  const [topNotifications, setTopNotifications] = useState<AppNotification[]>([]);
  const [kValue, setKValue] = useState<number>(10);

  useEffect(() => {
    if (!token) {
      Log('frontend', 'warn', 'page', 'Attempted to load Priority Inbox without auth token');
      setError('You are not authorized. Please authenticate first.');
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        Log('frontend', 'info', 'page', 'Initializing fetch for notifications from API');
        
        const response = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        Log('frontend', 'info', 'page', `Successfully retrieved ${response.data.notifications?.length || 0} notifications`);
        const notifications: AppNotification[] = response.data.notifications || [];
        setAllNotifications(notifications);

      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch notifications';
        setError(errorMsg);
        Log('frontend', 'error', 'page', `Failed to load priority inbox: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  useEffect(() => {
    if (allNotifications.length === 0) return;

    const pq = new TopKNotifications(kValue);
    
    Log('frontend', 'info', 'page', `Processing notifications through Min-Heap Priority Queue (K=${kValue})`);
    allNotifications.forEach(notif => {
      pq.insert(notif);
    });

    const topK = pq.getTop();
    setTopNotifications(topK);
    Log('frontend', 'info', 'page', `Successfully evaluated and rendered top ${topK.length} priority notifications`);
  }, [allNotifications, kValue]);

  const getChipColor = (type: string) => {
    switch (type) {
      case 'Placement': return 'error';
      case 'Result': return 'warning';
      case 'Event': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 6, px: { xs: 2, sm: 4, md: 6 } }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
            Priority Inbox
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Displaying your top priority unread notifications based on weight and recency.
          </Typography>
        </Box>
        
        <FormControl sx={{ minWidth: 120, bgcolor: 'white', borderRadius: 1 }}>
          <InputLabel id="k-select-label" sx={{ color: 'black' }}>Top 'n' Limit</InputLabel>
          <Select
            labelId="k-select-label"
            value={kValue}
            label="Top 'n' Limit"
            onChange={(e) => setKValue(Number(e.target.value))}
            sx={{ color: 'black', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.23)' } }}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && topNotifications.length === 0 && (
        <Alert severity="info">No new notifications found in your inbox.</Alert>
      )}

      {!loading && !error && topNotifications.length > 0 && (
        <Stack spacing={3}>
          {topNotifications.map((notif, index) => (
            <Paper 
              key={notif.ID} 
              elevation={2} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column',
                borderLeft: 6,
                borderColor: `${getChipColor(notif.Type)}.main`
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Chip label={notif.Type} color={getChipColor(notif.Type) as any} size="small" />
                <Typography variant="caption" color="textSecondary">
                  {new Date(notif.Timestamp.replace(' ', 'T')).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                {notif.Message}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                Priority Rank: #{index + 1} | ID: {notif.ID}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}
