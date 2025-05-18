import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import type { BoundingBox } from './ResultsComponent';

interface UploadComponentProps {
  onComplete?: (result: any) => void;
}

interface ModelResult {
  alertBoxes: BoundingBox[];
  totalBoxes: number;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ onComplete }) => {
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Porfavor selecciona una imagen JPEG o PNG.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('La imagen es demasiado grande (máx. 5MB).');
        return;
      }
      
      setImage(file);
      setError(null);
      
      // Call API automatically after setting the image
      await handleUpload(file);
    }
  };

  const handleUpload = async (fileToUpload: File) => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('image', fileToUpload);

    try {
      // const response = await axios.post('http://localhost:5000/upload', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate a delay for loading
      setLoading(false);

      const fakeResponse: ModelResult = {
        alertBoxes: [
          { id: "0000001", x1: 0, y1: 0, x2: 20, y2: 20, alert: "Alerta 1" },
          { id: "0000002", x1: 50, y1: 50, x2: 70, y2: 70, alert: "Alerta 2" },
        ],
        totalBoxes: 8,
      }

      // Call the callback with the result and the image
      if (onComplete) {
        onComplete({
          // result: response.data,
          result: {
            alertBoxes: fakeResponse.alertBoxes,
            totalBoxes: fakeResponse.totalBoxes,
          },
          image: fileToUpload
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      setError('Error processing the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!loading ? (
        <>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            disabled={loading}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {image && <p>Selected: {image.name}</p>}
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
          <p>Processing your image...</p>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;