import React, { useState } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import UploadComponent from './UploadComponent';

// Define the grid configuration
interface GridCell {
  segmentId: string | null;
  width: number;
  height: number;
}

interface MapComponentProps {
  setAppView: (view: 'map' | 'upload' | 'loading' | 'results') => void;
  setImage: (image: File | null) => void; 
  setApiResult: (result: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ setAppView, setImage, setApiResult }) => {
  // Grid configuration
  const cellWidth = 70;
  const cellHeight = 70;
  const gridGap = 0;

  // Define your store layout as a matrix
  // null represents empty space, string values represent segment IDs
  const storeLayout: (string | null)[][] = [
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', null, null, null, null, null, null, null, 'x'],
    ['x', null, 'Alimentos', 'Hogar', null, 'x', 'x', null, null],
    ['x', null, 'x', 'x', null, 'x', 'x', null, null],
    ['x', null, 'x', 'x', null, 'x', 'x', null, null],
    ['x', null, 'x', 'x', null, 'x', 'x', null, null],
  ];

  // Calculate SVG dimensions based on grid size
  const svgWidth = storeLayout[0].length * (cellWidth + gridGap);
  const svgHeight = storeLayout.length * (cellHeight + gridGap);

  const [segmentColors, setSegmentColors] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const handleSegmentClick = (segmentId: string) => {
    // setSegmentColors((prev) => ({
    //   ...prev,
    //   [segmentId]: prev[segmentId] === 'red' ? 'lightblue' : 'red',
    // }));
    
    // // Open modal and set selected segment
    setSelectedSegment(segmentId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleUploadComplete = ({ result, image }: { result: any, image: File }) => {
    // Close the modal
    setModalOpen(false);
    
    // Set state in the parent App component
    setImage(image);
    setApiResult(result);
    setAppView('results');
    
    console.log('Upload complete:', result);
    console.log('Image:', image);
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
        overflow: 'auto', // Add scrolling if necessary
      }}
    >
      <svg width={svgWidth} height={svgHeight}>
        {storeLayout.map((row, rowIndex) => 
          row.map((cell, colIndex) => {
            if (cell === null) return null; // Skip empty cells
            
            return (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * (cellWidth + gridGap)}
                y={rowIndex * (cellHeight + gridGap)}
                width={cellWidth}
                height={cellHeight}
                fill={segmentColors[cell] || 'lightgray'}
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
            Nombre del segmento: {selectedSegment}
          </Typography>
          <UploadComponent onComplete={handleUploadComplete} />
        </Box>
      </Modal>
    </div>
  );
};

export default MapComponent;