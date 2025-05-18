import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Slider, Box, Typography } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import type { ModelResult } from './UploadComponent';

interface MarkedImageComponentProps {
  imageSrc: string;
  results: ModelResult[];
}

const MarkedImageComponent: React.FC<MarkedImageComponentProps> = ({ imageSrc, results }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Set container dimensions on mount and resize
  useEffect(() => {
    const updateContainerDimensions = () => {
      if (containerRef.current) {
        // Account for padding (40px = 20px padding on each side)
        setContainerWidth(containerRef.current.clientWidth - 40);
        setContainerHeight(containerRef.current.clientHeight - 40);
      }
    };

    updateContainerDimensions();
    window.addEventListener('resize', updateContainerDimensions);
    
    return () => window.removeEventListener('resize', updateContainerDimensions);
  }, []);

  // Calculate appropriate zoom when image loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    
    setNaturalWidth(img.naturalWidth);
    setNaturalHeight(img.naturalHeight);
    
    // If container dimensions are available, calculate fit zoom
    if (containerWidth && containerHeight) {
      const widthRatio = containerWidth / img.naturalWidth;
      const heightRatio = containerHeight / img.naturalHeight;
      
      // Use the smaller ratio to ensure the entire image fits
      const fitZoom = Math.min(widthRatio, heightRatio, 1);
      setZoomLevel(Math.max(0.1, fitZoom)); // Ensure minimum zoom of 0.1
    }
    
    setImageLoaded(true);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 3)); // Max zoom 300%
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.1)); // Min zoom 10% 
  };
  
  const handleZoomChange = (event: Event, newValue: number | number[]) => {
    setZoomLevel(newValue as number);
  };
  
  // Reset zoom to fit the entire image
  const handleResetZoom = () => {
    if (naturalWidth && naturalHeight && containerWidth && containerHeight) {
      const widthRatio = containerWidth / naturalWidth;
      const heightRatio = containerHeight / naturalHeight;
      const fitZoom = Math.min(widthRatio, heightRatio, 1);
      setZoomLevel(Math.max(0.1, fitZoom));
    }
  };
  
  // Calculate font size based on image size and zoom level
  const calculateFontSize = () => {
    // Base size calculation with larger values - minimum 18px, maximum 36px
    const baseSize = Math.min(
      Math.max(18, Math.min(naturalWidth, naturalHeight) / 80),
      36
    );
    
    // Apply a formula that makes text readable at any zoom level
    // The smaller divisor (1.2 instead of sqrt(zoomLevel)) keeps text larger at higher zoom levels
    return baseSize / Math.min(1.2, Math.sqrt(zoomLevel));
  };
  
  const fontSize = calculateFontSize();
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        width: '50vw',
        height: '100%',
        overflow: 'auto',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <Box sx={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '10px',
        justifyContent: 'flex-end',
        paddingRight: '10px'
      }}>
        <IconButton onClick={handleResetZoom} size="small" title="Fit to view">
          <ZoomOutMapIcon />
        </IconButton>
        <IconButton onClick={handleZoomOut} size="small">
          <ZoomOutIcon />
        </IconButton>
        <Slider
          value={zoomLevel}
          min={0.1}
          max={3}
          step={0.1}
          onChange={handleZoomChange}
          aria-labelledby="zoom-slider"
          sx={{ width: '100px' }}
        />
        <IconButton onClick={handleZoomIn} size="small">
          <ZoomInIcon />
        </IconButton>
        <Typography variant="body2" sx={{ minWidth: '40px' }}>
          {Math.round(zoomLevel * 100)}%
        </Typography>
      </Box>
      
      <div style={{ 
        position: 'relative', 
        display: 'inline-block',
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'top left',
      }}>
        <img 
          src={imageSrc} 
          alt="Uploaded" 
          style={{ 
            width: 'auto',    
            height: 'auto',
            display: 'block',
            maxWidth: 'none'
          }}
          onLoad={handleImageLoad}
        />
        {/* Show all results in the image view */}
        {imageLoaded && results.map((res, i) => {
          // Skip if no bounding box coordinates
          if (!res.bbox || res.bbox.length < 4) return null;
          
          // Check if this alert has been omitted
          const isOmitted = res.alerta.startsWith("Omitido:");
          
          return (
            <div
              key={i+1}
              style={{
                position: 'absolute',
                left: res.bbox[0],
                top: res.bbox[1],
                width: res.bbox[2] - res.bbox[0],
                height: res.bbox[3] - res.bbox[1],
                border: `2px solid ${isOmitted ? '#888888' : 'red'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                backgroundColor: isOmitted ? 'rgba(136, 136, 136, 0.3)' : 'rgba(255, 0, 0, 0.5)',
                fontSize: `${fontSize}px`,
                fontWeight: 'bold'
              }}
            >
              {i+1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarkedImageComponent;