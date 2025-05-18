import React from 'react';
import { Button, Stack } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface ActionButtonsProps {
  onBackToMap: () => void;
  onTakeNewPicture: () => void;
  completionPercentage: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onBackToMap, 
  onTakeNewPicture, 
  completionPercentage 
}) => {
  return (
    <Stack direction="row" spacing={2}>
      {/* Take New Picture Button */}
      <Button 
        variant="contained" 
        color="secondary" 
        size="large"
        startIcon={<PhotoCameraIcon />}
        onClick={onTakeNewPicture}
        sx={{ py: 1.5, flexGrow: 1 }}
      >
        Tomar otra foto
      </Button>
      
      {/* Back to Map Button */}
      <Button 
        variant="contained" 
        color="primary" 
        size="large"
        startIcon={<MapIcon />}
        onClick={onBackToMap}
        sx={{ py: 1.5, flexGrow: 1 }}
      >
        Volver al mapa ({completionPercentage}% completado)
      </Button>
    </Stack>
  );
};

export default ActionButtons;