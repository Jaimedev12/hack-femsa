import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
import theme from './theme';
import MapComponent from './components/MapComponent';
import UploadComponent from './components/UploadComponent';
import ResultsComponent from './components/ResultsComponent';
import type { ModelResult } from './components/UploadComponent';

const App: React.FC = () => {
  const [view, setView] = useState<'map' | 'upload' | 'loading' | 'results'>('map');
  const [image, setImage] = useState<File | null>(null);
  const [apiResult, setApiResult] = useState<ModelResult[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  // Track segment completion status
  const [segmentStatus, setSegmentStatus] = useState<Record<string, { percentage: number, color: string }>>({});

  const handleUploadComplete = ({ result, image }: { result: ModelResult[], image: File }) => {
    setImage(image);
    setApiResult(result);
    setView('results');
  };

  const handleBackToMap = (segment: string, percentage: number) => {
    // Determine color based on completion percentage using theme colors
    let color;
    
    if (percentage >= 70) {
      color = theme.palette.success.main; // Green for high completion
    } else if (percentage >= 40) {
      color = theme.palette.warning.main; // Yellow for medium completion
    } else {
      color = theme.palette.error.main; // Red for low completion
    }
    
    // Update segment status
    setSegmentStatus(prev => ({
      ...prev,
      [segment]: { percentage, color }
    }));
    
    // Return to map view
    setView('map');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <AppBar position="static" sx={{ minHeight: '10%' }}>
          <Toolbar>
            <img 
              src="src/assets/oxxo_Logo.png" 
              alt="OXXO Logo" 
              style={{ height: '32px', marginRight: '12px' }} 
            />
            <Typography variant="h6">
              Store Analysis Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        
        <div style={{  
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90%',
          flex: 1,
        }}>
          {view === 'map' && (
            <MapComponent 
              setAppView={setView}
              setImage={setImage}
              setApiResult={setApiResult}
              selectedSegment={selectedSegment}
              setSelectedSegment={setSelectedSegment}
              segmentStatus={segmentStatus}
            />
          )}
          {view === 'upload' && <UploadComponent onComplete={handleUploadComplete} />}
          {view === 'results' && apiResult && (
            <ResultsComponent 
              imageSrc={URL.createObjectURL(image as File)} 
              results={apiResult} 
              segment={selectedSegment || 'Unknown'}
              onBackToMap={handleBackToMap}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;