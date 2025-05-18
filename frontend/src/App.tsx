import React, { useState } from 'react';
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
    // Determine color based on completion percentage
    let color = '#f44336'; // Red for low completion
    if (percentage >= 70) {
      color = '#4caf50'; // Green for high completion
    } else if (percentage >= 40) {
      color = '#ff9800'; // Orange for medium completion
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
    <div style={{  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      minWidth: '100vw',
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
  );
};

export default App;