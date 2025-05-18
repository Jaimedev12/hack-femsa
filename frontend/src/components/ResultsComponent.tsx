import React, { useState, useEffect } from 'react';
import AlertList from './AlertList';
import MarkedImageComponent from './MarkedImageComponent';
import type { ModelResult } from './UploadComponent';

const ResultsComponent: React.FC<{ imageSrc: string; results: ModelResult[] }> = ({ imageSrc, results: initialResults }) => {
  // Maintain results as component state so we can update it
  const [results, setResults] = useState<ModelResult[]>(initialResults);
  
  // Filter out "Producto correcto" results for the alert list
  const filteredAlerts = results.filter(res => (res.alerta !== "Producto correcto"));
  
  // Function to update an alert's status
  const handleAlertUpdate = (id: number, newAlertStatus: string) => {
    setResults(prevResults => 
      prevResults.map(result => 
        result.id === id ? { ...result, alerta: newAlertStatus } : result
      )
    );
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Use the new MarkedImageComponent */}
      <MarkedImageComponent imageSrc={imageSrc} results={filteredAlerts} />
      
      {/* Pass the update function to AlertList */}
      <AlertList 
        results={filteredAlerts} 
        onAlertUpdate={handleAlertUpdate}
      />
    </div>
  );
};

export default ResultsComponent;