import React, { useState } from 'react';
import { 
  Button, 
  Popover, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemText,
  TextField,
  Paper,
  Typography
} from '@mui/material';
import type { ModelResult } from './UploadComponent';

interface AlertListProps {
  results: ModelResult[];
  onAlertUpdate: (id: number, newAlertStatus: string) => void;
}

const AlertList: React.FC<AlertListProps> = ({ results, onAlertUpdate }) => {
  // State to track which popover is open
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [otherReason, setOtherReason] = useState<string>('');
  const [showOtherInput, setShowOtherInput] = useState<boolean>(false);

  // Handle opening the popover
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, itemId: number) => {
    setAnchorEl(event.currentTarget);
    setActiveItemId(itemId);
    setShowOtherInput(false);
  };

  // Handle closing the popover
  const handleClose = () => {
    setAnchorEl(null);
    setActiveItemId(null);
    setOtherReason('');
  };

  // Handle selecting an option
  const handleOptionSelect = (option: string) => {
    if (option === 'Otro') {
      setShowOtherInput(true);
    } else {
      // Find the original alert text for the active item
      const activeItem = results.find(res => res.id === activeItemId);
      if (activeItem) {
        console.log(`Alert ${activeItemId} ignored with reason: ${option}`);
        onAlertUpdate(activeItemId!, `Omitido: ${option} - [${activeItem.alerta}]`);
      }
      handleClose();
    }
  };

  // Handle submitting the other reason
  const handleOtherReasonSubmit = () => {
    // Find the original alert text for the active item
    const activeItem = results.find(res => res.id === activeItemId);
    if (activeItem) {
      console.log(`Alert ${activeItemId} ignored with reason: ${otherReason}`);
      onAlertUpdate(activeItemId!, `Omitido: ${otherReason} - [${activeItem.alerta}]`);
    }
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <div style={{ 
      width: '50vw',
      height: '100%',
      overflow: 'auto',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h2>Alerts</h2>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map((res, i) => {
          // Check if this alert has been omitted
          const isOmitted = res.alerta.startsWith("Omitido:");
          
          // Extract original alert if omitted
          let originalAlert = res.alerta;
          let omitReason = "";
          
          if (isOmitted) {
            const match = res.alerta.match(/Omitido: (.*) - \[(.*)\]/);
            if (match) {
              omitReason = match[1];
              originalAlert = match[2];
            }
          }
          
          return (
            <li 
              key={i+1}
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
                <strong>ID: {i+1}</strong><br/>
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
                  res.alerta
                )}
              </div>
              {!isOmitted && (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small"
                  onClick={(e) => handleClick(e, res.id)}
                >
                  Omitir
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 200, maxWidth: '100%' }}>
          {!showOtherInput ? (
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleOptionSelect('Sin inventario')}>
                  <ListItemText primary="Sin inventario" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleOptionSelect('Producto caducado')}>
                  <ListItemText primary="Producto caducado" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleOptionSelect('Producto no existente')}>
                  <ListItemText primary="Producto no existente" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleOptionSelect('Alerta errónea')}>
                  <ListItemText primary="Alerta errónea" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleOptionSelect('Otro')}>
                  <ListItemText primary="Otro" />
                </ListItemButton>
              </ListItem>
            </List>
          ) : (
            <div style={{ padding: '10px' }}>
              <TextField
                autoFocus
                margin="dense"
                id="reason"
                label="Especifique"
                type="text"
                fullWidth
                variant="outlined"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
              <Button 
                onClick={handleOtherReasonSubmit}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
              >
                Confirmar
              </Button>
            </div>
          )}
        </Paper>
      </Popover>
    </div>
  );
};

export default AlertList;