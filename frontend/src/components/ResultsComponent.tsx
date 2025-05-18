import React, { useState } from 'react';
import AlertList from './AlertList';
import MarkedImageComponent from './MarkedImageComponent';
import type { ModelResult } from './UploadComponent';

const ResultsComponent: React.FC<{ imageSrc: string; results: ModelResult[] }> = ({ imageSrc, results: initialResults }) => {
  // Maintain results as component state so we can update it
  const [results, setResults] = useState<ModelResult[]>(initialResults);
  
  // Filter out "Producto correcto" results for the alert list
  const filteredAlerts = results.filter(res => (res.alerta !== "Producto correcto"));
  
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
  
  return (
    <div style={{ 
      display: 'flex', 
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Use the new MarkedImageComponent */}
      <MarkedImageComponent imageSrc={imageSrc} results={filteredAlerts} />
      
      {/* Pass the update function and statistics to AlertList */}
      <AlertList 
        results={filteredAlerts} 
        onAlertUpdate={handleAlertUpdate}
        stats={{
          total: totalAlerts,
          good: goodAlerts,
          percentage: donePercentage
        }}
      />
    </div>
  );
};

export default ResultsComponent;