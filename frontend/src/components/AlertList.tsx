import React, { useState } from 'react';
import { Button, Typography, Paper } from '@mui/material';
import type { ModelResult } from './UploadComponent';
import StatsDisplay from './StatsDisplay';
import ActionButtons from './ActionButtons';
import OmitReasonPopover from './OmitReasonPopover';
import AlertItem from './AlertItem';

interface AlertListProps {
  results: ModelResult[];
  onAlertUpdate: (id: number, newAlertStatus: string) => void;
  onBackToMap: () => void;
  onTakeNewPicture: () => void;
  segment: string;
  stats: {
    total: number;
    good: number;
    percentage: number;
  };
}

const AlertList: React.FC<AlertListProps> = ({
  results,
  onAlertUpdate,
  onBackToMap,
  onTakeNewPicture,
  segment,
  stats
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);

  const handleOmitClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedAlertId(id);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedAlertId(null);
  };

  const handleSelectReason = (reason: string) => {
    if (selectedAlertId !== null) {
      // Find the original alert text to preserve in the omit message
      const alert = results.find(r => r.id === selectedAlertId);
      if (alert) {
        onAlertUpdate(selectedAlertId, `Omitido: ${reason} - [${alert.alerta}]`);
      }
    }
    handleClosePopover();
  };

  return (
    <Paper elevation={3} sx={{ 
      width: '50vw', 
      height: '100%', 
      p: 3, 
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Typography variant="h5" gutterBottom>
        Segmento: {segment}
      </Typography>
      
      <StatsDisplay
        total={stats.total}
        good={stats.good}
        percentage={stats.percentage}
      />
      
      <div style={{ 
        flex: 1,
        overflow: 'auto',
        marginBottom: '20px'
      }}>
        <Typography variant="h6" gutterBottom>
          Alertas detectadas
        </Typography>
        
        {results.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {results.map((alert, index) => (
              <AlertItem 
                key={index}
                alert={alert}
                index={index}
                onOmit={handleOmitClick}
              />
            ))}
          </ul>
        ) : (
          <Typography variant="body1">
            No hay alertas para mostrar.
          </Typography>
        )}
      </div>
      
      <ActionButtons
        onBackToMap={onBackToMap}
        onTakeNewPicture={onTakeNewPicture}
        completionPercentage={stats.percentage}
      />
      
      <OmitReasonPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        onSelectReason={handleSelectReason}
      />
    </Paper>
  );
};

export default AlertList;