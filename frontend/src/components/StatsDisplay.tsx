import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

interface StatsDisplayProps {
  total: number;
  good: number;
  percentage: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ total, good, percentage }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 2
      }}
    >
      <div>
        <Typography variant="h6" sx={{ mb: 1 }}>Resumen de productos</Typography>
        <Typography variant="body2">
          Total: <strong>{total}</strong> | Alertas: <strong>{total - good}</strong>
        </Typography>
      </div>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={100}
          thickness={5}
          sx={{
            color: percentage < 40 ? '#f44336' : 
            percentage < 70 ? '#ff9800' : 
            '#4caf50',
          }}
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
          <Typography variant="h5" component="div">
            {percentage}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsDisplay;