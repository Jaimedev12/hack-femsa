import React from 'react';
import { Button, Typography, useTheme } from '@mui/material';
import type { ModelResult } from './UploadComponent';

interface AlertItemProps {
  alert: ModelResult;
  index: number;
  onOmit: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, index, onOmit }) => {
  const theme = useTheme();
  // Check if this alert has been omitted
  const isOmitted = alert.alerta.startsWith("Omitido:");
  
  // Extract original alert if omitted
  let originalAlert = alert.alerta;
  let omitReason = "";
  
  if (isOmitted) {
    const match = alert.alerta.match(/Omitido: (.*) - \[(.*)\]/);
    if (match) {
      omitReason = match[1];
      originalAlert = match[2];
    }
  }
  
  return (
    <li 
      style={{
        padding: '16px',
        margin: '12px 0',
        backgroundColor: isOmitted 
          ? theme.palette.background.paper
          : theme.palette.background.default,
        borderLeft: `4px solid ${isOmitted 
          ? theme.palette.text.secondary 
          : theme.palette.error.main}`,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <div>
        <Typography variant="subtitle1" fontWeight="bold">ID: {index+1}</Typography>
        <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
          {alert.nombre}
        </Typography>
        
        {isOmitted ? (
          <>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              <strong>Motivo:</strong> {omitReason}
            </Typography>
            <Typography sx={{ textDecoration: 'line-through' }}>
              {originalAlert}
            </Typography>
          </>
        ) : (
          <Typography>{alert.alerta}</Typography>
        )}
      </div>
      {!isOmitted && (
        <Button 
          variant="contained" 
          color="error" 
          size="small"
          onClick={(e) => onOmit(e, alert.id)}
          sx={{ minWidth: '80px' }}
        >
          Omitir
        </Button>
      )}
    </li>
  );
};

export default AlertItem;