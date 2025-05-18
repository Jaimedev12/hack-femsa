import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
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
  // Maintain results as component state so we can update it
  const [results, setResults] = useState<ModelResult[]>(initialResults);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(imageSrc);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  
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
      overflow: 'hidden'
    }}>
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
          <h2 id="upload-modal-title">Tomar nueva foto del segmento {segment}</h2>
          <UploadComponent onComplete={handleUploadComplete} />
        </Box>
      </Modal>
    </div>
  );
};

export default ResultsComponent;