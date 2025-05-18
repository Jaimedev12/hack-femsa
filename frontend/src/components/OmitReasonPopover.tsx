import React, { useState } from 'react';
import { 
  Popover,
  List, 
  ListItem, 
  ListItemButton,
  ListItemText,
  TextField,
  Button,
  Paper
} from '@mui/material';

interface OmitReasonPopoverProps {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  onSelectReason: (reason: string) => void;
}

const OmitReasonPopover: React.FC<OmitReasonPopoverProps> = ({ 
  open, 
  anchorEl, 
  onClose, 
  onSelectReason 
}) => {
  const [otherReason, setOtherReason] = useState<string>('');
  const [showOtherInput, setShowOtherInput] = useState<boolean>(false);

  const handleOptionSelect = (option: string) => {
    if (option === 'Otro') {
      setShowOtherInput(true);
    } else {
      onSelectReason(option);
      onClose();
    }
  };

  const handleOtherReasonSubmit = () => {
    if (otherReason.trim()) {
      onSelectReason(otherReason);
    }
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
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
  );
};

export default OmitReasonPopover;