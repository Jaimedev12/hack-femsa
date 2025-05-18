import React from 'react';
import { Button, Typography, Paper } from '@mui/material';
import type { ModelResult } from './UploadComponent';
interface AlertItemProps {
  alert: ModelResult;
  index: number;
  onOmit: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, index, onOmit }) => {
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
        padding: '10px',
        margin: '10px 0',
        backgroundColor: isOmitted ? '#f0f0f0' : '#f5f5f5',
        borderLeft: `4px solid ${isOmitted ? 'gray' : 'red'}`,
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>
        <strong>ID: {index+1}</strong><br/>
        {isOmitted ? (
          <>
            <Typography sx={{ color: 'gray' }}>
              <strong>Motivo:</strong> {omitReason}
            </Typography>
            <Typography sx={{ textDecoration: 'line-through' }}>
              {originalAlert}
            </Typography>
          </>
        ) : (
          alert.alerta
        )}
      </div>
      {!isOmitted && (
        <Button 
          variant="outlined" 
          color="primary" 
          size="small"
          onClick={(e) => onOmit(e, alert.id)}
        >
          Omitir
        </Button>
      )}
    </li>
  );
};

export default AlertItem;