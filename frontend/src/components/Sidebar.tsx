import React from 'react';
import { Drawer, Box, IconButton, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';

interface SidebarProps {
  currentView: 'map' | 'upload' | 'loading' | 'results';
  onNavigate: (view: 'map' | 'upload' | 'loading' | 'results') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView,
  onNavigate 
}) => {
  const theme = useTheme();
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: '10vw',
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: '10vw', 
          boxSizing: 'border-box',
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: '100%', 
        py: 2
      }}>
        {/* Logo at top */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%', 
          mb: 4
        }}>
          <Box 
            component="img"
            src="src/assets/oxxo_Logo.png"
            alt="OXXO Logo"
            sx={{ 
              width: '80%', 
              maxWidth: '80px',
              mb: 2 
            }}
          />
        </Box>
        
        {/* Navigation Items */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          flex: 1,
          alignItems: 'center'
        }}>
          {/* Main dashboard button - expanded when active */}

            
          <Box
            // onClick={() => onNavigate('map')}
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: "95%",
              padding:'16px 8px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            <DashboardIcon 
              sx={{ 
                fontSize: 32,
              }} 
            />

            <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '10px',
                  textAlign: 'center',
                  letterSpacing: '0.5px',
                  mt: 0.5
                }}
              >
                GESTIÓN DE ANAQUELES
              </Typography>
          </Box>
        </Box>
        
        {/* Bottom section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          pt: 2,
          alignItems: 'center'
        }}>
          {/* Settings button */}
          <Box
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '70%',
              padding: '10px 8px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            <SettingsIcon fontSize="large" />
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '10px',
                mt: 0.5,
                letterSpacing: '0.5px'
              }}
            >
              AJUSTES
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;