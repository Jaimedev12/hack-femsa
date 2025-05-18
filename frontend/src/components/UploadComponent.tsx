import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

interface UploadComponentProps {
  onComplete?: (result: any) => void;
}

export interface ModelResult {
  id: number;
  nombre: string;
  bbox: number[];
  alerta: string;
}

/*

[
     {
    "id": 43,
    "nombre": "Papel Regio Rinde 4pz",
    "bbox": [239.92279052734375, 2690.970703125, 721.9126586914062, 3151.9345703125] 
  },
  {
    "id": 47,
    "nombre": "Shampoo KleenBebe Manzanilla 250ml",

    "bbox": [296.0941467285156, 1279.9599609375, 423.6428527832031, 1696.7999267578125] 
  } 
]

*/

const UploadComponent: React.FC<UploadComponentProps> = ({ onComplete }) => {
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

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

      const fakeResponse: ModelResult[] = [
        {
          id: 1,
          nombre: "Papel Regio Rinde 4pz",
          bbox: [30, 30, 60, 60],
          alerta: "Producto mal acomodado"
        },
        {
          id: 2,
          nombre: "Shampoo KleenBebe Manzanilla 250ml",
          bbox: [80, 80, 110, 110],
          alerta: "Producto faltante"
        },
        {
          id: 3,
          nombre: "Shampoo KleenBebe Manzanilla 250ml",
          bbox: [130, 130, 160, 160],
          alerta: "Producto correcto"
        },
        {
          id: 4,
          nombre: "Shampoo KleenBebe Manzanilla 250ml",
          bbox: [130, 130, 160, 160],
          alerta: "Producto faltante"
        }
      ];

      // Call the callback with the result and the image
      if (onComplete) {
        onComplete({
          // result: response.data,
          result: fakeResponse,
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