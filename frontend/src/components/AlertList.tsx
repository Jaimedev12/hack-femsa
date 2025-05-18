import React, { useState } from 'react';
import { Button, Typography, Paper, Chip, Stack, Divider, Box, useTheme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
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
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);

  // Filter alerts
  const missingProducts = results.filter(
    alert => alert.alerta === "Producto faltante" && 
             !alert.alerta.startsWith("Omitido:") // Don't include already omitted items
  );
  
  // Filter to exclude "Producto faltante" from the main list
  const regularAlerts = results.filter(
    alert => alert.alerta !== "Producto faltante" || 
             alert.alerta.startsWith("Omitido:") // Keep omitted missing products in the main list
  );
  
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
      
      {/* Header for Missing Products section */}
      {missingProducts.length > 0 && (
        <>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1.5
          }}>
            <ErrorOutlineIcon 
              color="error" 
              fontSize="medium" 
              sx={{ mr: 1 }} 
            />
            <Typography variant="subtitle1" fontWeight="bold">
              Productos faltantes ({missingProducts.length})
            </Typography>
          </Box>
          
          {/* Scrollable Missing Products container */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              mb: 2, 
              backgroundColor: theme.palette.error.light,
              borderLeft: `6px solid ${theme.palette.error.main}`,
              borderRadius: '8px',
              maxHeight: '25vh',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            {missingProducts.map((product) => (
              <Paper 
                key={`missing-${product.id}`}
                sx={{ 
                  p: 1.5, 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: '6px',
                  minHeight: '48px'
                }}
              >
                <Typography fontWeight="500">
                  {product.nombre}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={(e) => handleOmitClick(e, product.id)}
                >
                  Omitir
                </Button>
              </Paper>
            ))}
          </Paper>
        </>
      )}
      
      <Typography variant="h6" gutterBottom>
        Alertas detectadas
      </Typography>
      
      {/* Scrollable Alerts container */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        mb: 2,
        bgcolor: regularAlerts.length ? 'transparent' : theme.palette.background.paper,
        borderRadius: 1,
        p: regularAlerts.length ? 0 : 2,
      }}>
        {regularAlerts.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {regularAlerts.map((alert, index) => (
              <AlertItem 
                key={alert.id}
                alert={alert}
                index={index}
                onOmit={handleOmitClick}
              />
            ))}
          </ul>
        ) : (
          <Typography variant="body1">
            No hay alertas adicionales para mostrar.
          </Typography>
        )}
      </Box>
      
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