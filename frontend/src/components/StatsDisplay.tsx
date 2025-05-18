import React from 'react';
import { Paper, Typography, Box, CircularProgress, useTheme } from '@mui/material';

interface StatsDisplayProps {
  total: number;
  good: number;
  percentage: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ total, good, percentage }) => {
  const theme = useTheme();
  
  // Get color from theme based on percentage
  const getProgressColor = () => {
    if (percentage < 40) return theme.palette.error.main;
    if (percentage < 70) return theme.palette.warning.main;
    return theme.palette.success.main;
  };
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 2
      }}
    >
      <div>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Resumen de productos</Typography>
        <Typography variant="body1">
          Total: <strong>{total}</strong> | Alertas: <strong>{total - good}</strong>
        </Typography>
      </div>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={100}
          thickness={5}
          sx={{ color: getProgressColor() }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h5" component="div" fontWeight="bold">
            {percentage}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsDisplay;