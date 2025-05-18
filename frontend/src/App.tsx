import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import UploadComponent from './components/UploadComponent';
import ResultsComponent from './components/ResultsComponent';

const App: React.FC = () => {
  const [view, setView] = useState<'map' | 'upload' | 'loading' | 'results'>('map');
  const [image, setImage] = useState<File | null>(null);
  const [apiResult, setApiResult] = useState<any>(null);

  const handleUploadComplete = ({ result, image }: { result: any, image: File }) => {
    setImage(image);
    setApiResult(result);
    setView('results');
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
        />
      )}
      {view === 'upload' && <UploadComponent onComplete={handleUploadComplete} />}
      {view === 'results' && apiResult && (
        <ResultsComponent imageSrc={URL.createObjectURL(image as File)} boxes={apiResult.boxes} />
      )}
    </div>
  );
};

export default App;