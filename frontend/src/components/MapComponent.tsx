import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, useTheme } from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import DirectionsIcon from '@mui/icons-material/Directions';
import UploadComponent from './UploadComponent';
import { colors } from '../theme';

// Define cell types
type CellType = 'segment' | 'register' | 'entrance' | 'wall' | 'empty';

// Define cell interface with enhanced properties
interface StoreCell {
  id: string;
  type: CellType;
  name?: string;
  x: number;
  y: number;
  width: number; // In grid units
  height: number; // In grid units
  clickable: boolean;
  color?: string;
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
  const theme = useTheme();
  
  // Grid configuration
  const gridUnitSize = 50;
  const gridGap = 2;
  
  // Define store layout as array of cell objects
  const storeLayout: StoreCell[] = [
    // // Outer walls
    { id: 'wall-top', type: 'wall', x: 0, y: 0, width: 11, height: 1, clickable: false },
    { id: 'wall-right', type: 'wall', x: 10, y: 0, width: 1, height: 10, clickable: false },
    { id: 'wall-bottom', type: 'wall', x: 0, y: 9, width: 11, height: 1, clickable: false },
    { id: 'wall-left', type: 'wall', x: 0, y: 0, width: 1, height: 10, clickable: false },
    
    // Entrance
    { id: 'entrance', type: 'entrance', x: 0, y: 2, width: 1, height: 1, clickable: false },
    
    // Registers (cajas)
    { id: 'register-1', type: 'register', name: 'Caja 1', x: 3, y: 1, width: 2, height: 1, clickable: false },
    { id: 'register-2', type: 'register', name: 'Caja 2', x: 5, y: 1, width: 2, height: 1, clickable: false },
    
    // Product segments - various sizes
    { id: 'Helados 1', type: 'segment', name: 'Helados 1', x: 1, y: 3, width: 1, height: 2, clickable: true },
    { id: 'Helados 2', type: 'segment', name: 'Helados 2', x: 1, y: 5, width: 1, height: 2, clickable: true },
    { id: 'Sabritas 1', type: 'segment', name: 'Sabritas 1', x: 3, y: 3, width: 1, height: 2, clickable: true },
    { id: 'Sabritas 2', type: 'segment', name: 'Sabritas 2', x: 3, y: 5, width: 1, height: 2, clickable: true },
    { id: 'Galletas 1', type: 'segment', name: 'Galletas 1', x: 4, y: 3, width: 1, height: 2, clickable: true },
    { id: 'Galletas 2', type: 'segment', name: 'Galletas 2', x: 4, y: 5, width: 1, height: 2, clickable: true },

    { id: 'Alacena 1', type: 'segment', name: 'Alacena 1', x: 6, y: 3, width: 1, height: 2, clickable: true },
    { id: 'Alacena 2', type: 'segment', name: 'Alacena 2', x: 6, y: 5, width: 1, height: 2, clickable: true },
    { id: 'Hogar 1', type: 'segment', name: 'Hogar 1', x: 7, y: 3, width: 1, height: 2, clickable: true },
    { id: 'Hogar 2', type: 'segment', name: 'Hogar 2', x: 7, y: 5, width: 1, height: 2, clickable: true },

    { id: 'Alcohol', type: 'segment', name: 'Alcohol', x: 9, y: 3, width: 1, height: 2, clickable: true },
    { id: 'Agua', type: 'segment', name: 'Agua', x: 9, y: 5, width: 1, height: 2, clickable: true },
    { id: 'Comida', type: 'segment', name: 'Comida', x: 9, y: 1, width: 1, height: 2, clickable: true },
    { id: 'Refrescos 1', type: 'segment', name: 'Refrescos 1', x: 2, y: 8, width: 2, height: 1, clickable: true },
    { id: 'Refrescos 2', type: 'segment', name: 'Refrescos 2', x: 4, y: 8, width: 2, height: 1, clickable: true },
    { id: 'Refrescos 3', type: 'segment', name: 'Refrescos 3', x: 6, y: 8, width: 2, height: 1, clickable: true },
    { id: 'Refrescos 4', type: 'segment', name: 'Refrescos 4', x: 8, y: 8, width: 2, height: 1, clickable: true },

  ];
  
  // Calculate SVG dimensions
  const maxX = Math.max(...storeLayout.map(cell => cell.x + cell.width));
  const maxY = Math.max(...storeLayout.map(cell => cell.y + cell.height));
  const svgWidth = maxX * (gridUnitSize + gridGap);
  const svgHeight = maxY * (gridUnitSize + gridGap);
  
  const [modalOpen, setModalOpen] = useState(false);

  const handleSegmentClick = (cellId: string) => {
    setSelectedSegment(cellId);
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
  
  // Get cell fill color based on type and status
  const getCellFill = (cell: StoreCell) => {
    switch(cell.type) {
      case 'segment':
        return segmentStatus[cell.id]?.color || theme.palette.background.paper;
      case 'register':
        return theme.palette.secondary.light;
      case 'entrance':
        return theme.palette.success.light;
      case 'wall':
        return theme.palette.grey[500];
      default:
        return 'transparent';
    }
  };
  
  // Determine if cell should have a pointer cursor
  const getCellCursor = (cell: StoreCell) => {
    return cell.clickable ? 'pointer' : 'default';
  };
  
  // Get cell icon based on type
  const getCellIcon = (cell: StoreCell) => {
    switch(cell.type) {
      case 'register':
        return <PointOfSaleIcon sx={{ color: 'white', fontSize: gridUnitSize/2 }} />;
      case 'entrance':
        return <DirectionsIcon sx={{ color: 'white', fontSize: gridUnitSize/2 }} />;
      case 'segment':
        return null;
      default:
        return null;
    }
  };
  
  // Get status text for a segment
  const getSegmentStatus = (cellId: string) => {
    if (segmentStatus[cellId]) {
      return `${segmentStatus[cellId].percentage}%`;
    }
    return null;
  };
  
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Mapa de Tienda OXXO
      </Typography>
      
      <div style={{ 
        overflow: 'auto', 
        maxWidth: '100%', 
        maxHeight: '80vh',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        padding: '10px',
      }}>
        <svg width={svgWidth} height={svgHeight}>
          {/* Draw grid lines for reference */}
          {Array.from({ length: maxX }).map((_, i) => (
            <line 
              key={`vline-${i}`}
              x1={i * (gridUnitSize + gridGap)}
              y1={0}
              x2={i * (gridUnitSize + gridGap)}
              y2={svgHeight}
              stroke={theme.palette.divider}
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          {Array.from({ length: maxY }).map((_, i) => (
            <line 
              key={`hline-${i}`}
              x1={0}
              y1={i * (gridUnitSize + gridGap)}
              x2={svgWidth}
              y2={i * (gridUnitSize + gridGap)}
              stroke={theme.palette.divider}
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Draw cells */}
          {storeLayout.map((cell) => (
            <g key={cell.id}>
              <rect
                x={cell.x * (gridUnitSize + gridGap)}
                y={cell.y * (gridUnitSize + gridGap)}
                width={cell.width * gridUnitSize + (cell.width - 1) * gridGap}
                height={cell.height * gridUnitSize + (cell.height - 1) * gridGap}
                fill={getCellFill(cell)}
                stroke={theme.palette.divider}
                strokeWidth="1"
                rx={cell.type === 'wall' ? 0 : 4}
                ry={cell.type === 'wall' ? 0 : 4}
                style={{ cursor: getCellCursor(cell) }}
                onClick={() => cell.clickable && handleSegmentClick(cell.id)}
              />
              
              {/* Cell label */}
              {cell.name && (
                <text
                  x={cell.x * (gridUnitSize + gridGap) + (cell.width * gridUnitSize + (cell.width - 1) * gridGap) / 2}
                  y={cell.y * (gridUnitSize + gridGap) + (cell.height * gridUnitSize + (cell.height - 1) * gridGap) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={cell.type === 'wall' || cell.type === 'register' ? 'white' : 'black'}
                  style={{ 
                    fontSize: cell.width > 2 || cell.height > 2 ? '14px' : '12px',
                    fontWeight: 'bold',
                    pointerEvents: 'none' 
                  }}
                >
                  {cell.name}
                </text>
              )}
              
              {/* Status indicator for segments */}
              {cell.type === 'segment' && getSegmentStatus(cell.id) && (
                <text
                  x={cell.x * (gridUnitSize + gridGap) + (cell.width * gridUnitSize + (cell.width - 1) * gridGap) / 2}
                  y={cell.y * (gridUnitSize + gridGap) + (cell.height * gridUnitSize + (cell.height - 1) * gridGap) / 2 + 20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  style={{ 
                    fontSize: '14px',
                    fontWeight: 'bold',
                    pointerEvents: 'none',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {getSegmentStatus(cell.id)}
                </text>
              )}
              
              {/* Foreign object to place SVG icons */}
              {getCellIcon(cell) && (
                <foreignObject
                  x={cell.x * (gridUnitSize + gridGap) + (cell.width * gridUnitSize + (cell.width - 1) * gridGap) / 2 - gridUnitSize/4}
                  y={cell.y * (gridUnitSize + gridGap) + (cell.height * gridUnitSize + (cell.height - 1) * gridGap) / 2 - gridUnitSize/4}
                  width={gridUnitSize/2}
                  height={gridUnitSize/2}
                >
                  {getCellIcon(cell)}
                </foreignObject>
              )}
            </g>
          ))}
        </svg>
      </div>
      
      <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.secondary }}>
        Haga clic en un segmento para tomar una foto y analizar
      </Typography>

      {/* Modal for displaying UploadComponent */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="segment-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="segment-modal-title" variant="h6" component="h2" mb={2}>
            {segmentStatus[selectedSegment || '']?.percentage 
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