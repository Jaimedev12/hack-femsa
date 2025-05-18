import React, { useState } from 'react';
import { IconButton, Slider } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import type { ModelResult } from './UploadComponent';

interface MarkedImageComponentProps {
  imageSrc: string;
  results: ModelResult[];
}

const MarkedImageComponent: React.FC<MarkedImageComponentProps> = ({ imageSrc, results }) => {
  // Load image and get natural dimensions
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100% (original size)
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 3)); // Max zoom 300%
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.1)); // Min zoom 10% 
  };
  
  const handleZoomChange = (event: Event, newValue: number | number[]) => {
    setZoomLevel(newValue as number);
  };
  
  return (
    <div style={{ 
      position: 'relative',
      width: '50vw',
      height: '100%',
      overflow: 'auto',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
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
        <span>{Math.round(zoomLevel * 100)}%</span>
      </div>
      
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
          onLoad={() => setImageLoaded(true)}
        />
        {/* Show all results in the image view */}
        {imageLoaded && results.map((res, i) => (
          <div
            key={i+1}
            style={{
              position: 'absolute',
              left: res.bbox[0],
              top: res.bbox[1],
              width: res.bbox[2] - res.bbox[0],
              height: res.bbox[3] - res.bbox[1],
              border: '2px solid red',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              backgroundColor: 'rgba(255,0,0,0.5)',
              fontSize: '12px',
            }}
          >
            {i+1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarkedImageComponent;