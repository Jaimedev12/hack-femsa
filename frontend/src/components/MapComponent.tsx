import React, { useState } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import UploadComponent from './UploadComponent';

interface GridCell {
  segmentId: string | null;
  width: number;
  height: number;
}

interface MapComponentProps {
  setAppView: (view: 'map' | 'upload' | 'loading' | 'results') => void;
  setImage: (image: File | null) => void; 
  setApiResult: (result: any) => void;
  selectedSegment: string | null;
  setSelectedSegment: (segment: string) => void;
  segmentStatus: Record<string, { percentage: number, color: string }>;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  setAppView, 
  setImage, 
  setApiResult, 
  setSelectedSegment,
  segmentStatus,
  selectedSegment
}) => {
  // Grid configuration
  const cellWidth = 70;
  const cellHeight = 70;
  const gridGap = 0;

  // Define your store layout as a matrix
  const storeLayout: (string | null)[][] = [
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', null, null, null, null, null, null, null, 'x'],
    ['x', null, 'Alimentos', 'Hogar', null, 'x', 'x', null, null],
    ['x', null, 'x', 'x', null, 'x', 'x', null, null],
    ['x', null, 'x', 'x', null, 'x', 'x', null, null],
    ['x', null, 'x', 'x', null, 'x', 'x', null, null],
  ];

  const svgWidth = storeLayout[0].length * (cellWidth + gridGap);
  const svgHeight = storeLayout.length * (cellHeight + gridGap);

  const [modalOpen, setModalOpen] = useState(false);

  const handleSegmentClick = (segmentId: string) => {
    // Set selected segment
    setSelectedSegment(segmentId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleUploadComplete = ({ result, image }: { result: any, image: File }) => {
    setModalOpen(false);
    setImage(image);
    setApiResult(result);
    setAppView('results');
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
    <div
      style={{
        minWidth: '100%',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'auto',
      }}
    >
      <svg width={svgWidth} height={svgHeight}>
        {storeLayout.map((row, rowIndex) => 
          row.map((cell, colIndex) => {
            if (cell === null) return null; // Skip empty cells
            
            // Get segment color if available, otherwise use default
            const cellColor = segmentStatus[cell]?.color || 'lightgray';
            
            return (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * (cellWidth + gridGap)}
                y={rowIndex * (cellHeight + gridGap)}
                width={cellWidth}
                height={cellHeight}
                fill={cellColor}
                stroke="#333"
                strokeWidth="1"
                onClick={() => handleSegmentClick(cell)}
              />
            );
          })
        )}
      </svg>

      {/* Modal for displaying UploadComponent */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="segment-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="segment-modal-title" variant="h6" component="h2" mb={2}>
            Nombre del segmento: {segmentStatus[selectedSegment || '']?.percentage 
              ? `${selectedSegment} (${segmentStatus[selectedSegment || ''].percentage}% completado)` 
              : selectedSegment}
          </Typography>
          <UploadComponent onComplete={handleUploadComplete} />
        </Box>
      </Modal>
    </div>
  );
};

export default MapComponent;