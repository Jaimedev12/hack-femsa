import React, { useState } from 'react';
import { Modal, Box, Drawer, IconButton, Typography, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MapIcon from '@mui/icons-material/Map';
import AlertList from './AlertList';
import MarkedImageComponent from './MarkedImageComponent';
import UploadComponent from './UploadComponent';
import type { ModelResult } from './UploadComponent';

interface ResultsComponentProps {
  imageSrc: string;
  results: ModelResult[];
  segment: string;
  onBackToMap: (segment: string, percentage: number) => void;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ 
  imageSrc, 
  results: initialResults,
  segment,
  onBackToMap
}) => {
  const theme = useTheme();
  // Maintain results as component state so we can update it
  const [results, setResults] = useState<ModelResult[]>(initialResults);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(imageSrc);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  
  // Filter out "Producto correcto" results for the alert list
  const filteredAlerts = results.filter(res => (res.alerta !== "Producto correcto"));
  const filteredAlertsForImage = filteredAlerts.filter(res => (!res.alerta.includes("Producto faltante")));
  
  // Calculate statistics
  const totalAlerts = results.length;
  const badAlerts = filteredAlerts.filter(res => !res.alerta.startsWith("Omitido:")).length;
  const goodAlerts = totalAlerts - badAlerts;
  const donePercentage = badAlerts == 0 ? 100 : Math.round((goodAlerts / totalAlerts) * 100);

  // Function to update an alert's status
  const handleAlertUpdate = (id: number, newAlertStatus: string) => {
    setResults(prevResults => 
      prevResults.map(result => 
        result.id === id ? { ...result, alerta: newAlertStatus } : result
      )
    );
  };
  
  // Handle navigation back to map
  const handleBackToMap = () => {
    onBackToMap(segment, donePercentage);
  };
  
  // Handle taking a new picture
  const handleTakeNewPicture = () => {
    setUploadModalOpen(true);
  };
  
  // Handle the completion of the new image upload
  const handleUploadComplete = ({ result, image }: { result: ModelResult[], image: File }) => {
    setResults(result);
    setCurrentImageSrc(URL.createObjectURL(image));
    setUploadModalOpen(false);
  };
  
  // Toggle drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Drawer toggle button */}
      <IconButton 
        onClick={toggleDrawer} 
        sx={{ 
          position: 'absolute', 
          left: 16, 
          top: 16, 
          zIndex: 1200,
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          '&:hover': { 
            backgroundColor: theme.palette.primary.dark 
          }
        }}
      >
        <MapIcon />
      </IconButton>
      
      {/* Planogram drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: '40vw',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '40vw',
            boxSizing: 'border-box',
          },
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            height: '100%',
            padding: 2,
            backgroundColor: theme.palette.background.default
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              pb: 1
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Planograma: {segment}
            </Typography>
            <IconButton onClick={toggleDrawer} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box 
            sx={{ 
              flex: 1, 
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 1,
              backgroundColor: '#fff',
              borderRadius: 1,
              boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
            }}
          >
            <img 
              src="src/assets/planograma.png" 
              alt="Planograma" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain' 
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{ 
                mt: 2, 
                color: theme.palette.text.secondary,
                textAlign: 'center',
                fontStyle: 'italic'
              }}
            >
              Este planograma muestra la distribución ideal de productos en este segmento
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Use MarkedImageComponent with current image */}
      <MarkedImageComponent imageSrc={currentImageSrc} results={filteredAlertsForImage} />

      {/* Pass all handlers to AlertList */}
      <AlertList 
        results={filteredAlerts} 
        onAlertUpdate={handleAlertUpdate}
        onBackToMap={handleBackToMap}
        onTakeNewPicture={handleTakeNewPicture}
        segment={segment}
        stats={{
          total: totalAlerts,
          good: goodAlerts,
          percentage: donePercentage
        }}
      />
      
      {/* Modal for uploading a new image */}
      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        aria-labelledby="upload-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="upload-modal-title" variant="h6" component="h2" mb={2}>
            Tomar nueva foto del segmento {segment}
          </Typography>
          <UploadComponent onComplete={handleUploadComplete} />
        </Box>
      </Modal>
    </div>
  );
};

export default ResultsComponent;