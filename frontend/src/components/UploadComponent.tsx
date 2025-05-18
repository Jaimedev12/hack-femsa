import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

interface UploadComponentProps {
  onComplete?: (result: any) => void;
}

export interface ModelResult {
  id: string;
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
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const response = await axios.get('http://localhost:5000/get_alarms', {});
      console.log(response.data.alarms);
    
      // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate a delay for loading
      setLoading(false);

      const fakeResponse: ModelResult[] =[{'id': 1,
  'nombre': 'Higienico Suavel 325h 4rollos',
  'bbox': [],
  'alerta': 'Producto correcto'},
 {'id': 2,
  'nombre': 'Higienico Cottonelle Elegance XL 252h',
  'bbox': [],
  'alerta': 'Producto correcto'},
 {'id': 3,
  'nombre': 'Hig Petalo UltraJumbo 6s 234h',
  'bbox': [],
  'alerta': 'Producto correcto'},
 {'id': 4,
  'nombre': 'PAPEL HIGIENICO AZALEA 4S CON AROMA',
  'bbox': [],
  'alerta': 'Producto correcto'},
 {'id': 5,
  'nombre': 'Papel Higienico Azalea 6 Rollos 500 Hojas',
  'bbox': [],
  'alerta': 'Producto correcto'},
 {'id': 6,
  'nombre': 'Aceite para bebe Baby Magic Mennen 100 ml bote',
  'bbox': [],
  'alerta': 'Producto faltante'},
 {'id': 7,
  'nombre': 'Tikytin Ultra talla 5 X-Grande 36/4',
  'bbox': [],
  'alerta': 'Producto correcto'},
 {'id': 8,
  'nombre': 'NAN 3 OPTIPRO FI Lata 12x400g MX',
  'bbox': [],
  'alerta': 'Producto correcto'},
 {'id': 9,
  'nombre': 'AGUA BIOLEVE 1.5 LTS',
  'bbox': [],
  'alerta': 'Producto correcto'},
 {'id': 10,
  'nombre': 'AGUA ALCALINA VITAWA 1.5 LTS',
  'bbox': [],
  'alerta': 'Producto correcto'},
 {'id': 11,
  'nombre': 'Agua Bioleve 1L 6pack',
  'bbox': [],
  'alerta': 'Producto correcto'},
 {'id': 12,
  'nombre': 'AGUA PURIFICADA BIOLEVE 0.5L 8 PACK',
  'bbox': [],
  'alerta': 'Producto correcto'},
 {'id': 13,
  'nombre': 'AGUA ALCALINA VITAWA 1LT',
  'bbox': [458.85, 371.14, 666.4, 963.93],
  'alerta': 'Producto correcto'},
 {'id': 14,
  'nombre': 'Shampoo KleenBebe Manzanilla 250ml',
  'bbox': [296.09, 1279.95, 423.64, 1696.79],
  'alerta': 'Producto correcto'},
 {'id': 15,
  'nombre': 'Panales Tikytin 14pz T5',
  'bbox': [539.62, 1213.93, 851.47, 1673.29],
  'alerta': 'Producto correcto'},
 {'id': 16,
  'nombre': 'NAN 3 OPTIPRO Formula Infantil 12x400gMX',
  'bbox': [1535.09, 1343.76, 1755.97, 1668.22],
  'alerta': 'Producto mal acomodado'},
 {'id': 18,
  'nombre': 'DETERGENTE AZALEA MULTIUSOS 800G',
  'bbox': [103.23, 2351.51, 531.72, 2436.09],
  'alerta': 'Producto correcto'},
 {'id': 19,
  'nombre': 'AGUA ALCALINA VITAWA 1LT',
  'bbox': [1072.36, 361.32, 1259.42, 959.1],
  'alerta': 'Producto correcto'},
 {'id': 20,
  'nombre': 'AGUA ALCALINA VITAWA 1LT',
  'bbox': [669.96, 292.14, 898.35, 966.63],
  'alerta': 'Producto correcto'},
 {'id': 21,
  'nombre': 'Panales Tikytin 14pz T5',
  'bbox': [924.08, 1123.69, 1265.02, 1665.42],
  'alerta': 'Producto correcto'},
 {'id': 22,
  'nombre': 'AGUA ALCALINA VITAWA 1LT',
  'bbox': [881.27, 364.79, 1075.76, 960.12],
  'alerta': 'Producto correcto'},
 {'id': 23,
  'nombre': 'DETERGENTE AZALEA MULTIUSOS 800G',
  'bbox': [162.28, 2225.16, 582.93, 2324.78],
  'alerta': 'Producto correcto'},
 {'id': 24,
  'nombre': 'NAN 1 OPTIPRO Formula Infantil 12x400gMX',
  'bbox': [1999.35, 1342.34, 2245.11, 1667.92],
  'alerta': 'Producto mal acomodado'},
 {'id': 25,
  'nombre': 'Panales Tikytin 14pz T5',
  'bbox': [1266.1, 1133.66, 1584.44, 1668.34],
  'alerta': 'Producto correcto'},
 {'id': 26,
  'nombre': 'PAPEL HIGIENICO AZALEA 4 ROLLOS 350 HOJAS',
  'bbox': [590.21, 1967.93, 1045.48, 2418.35],
  'alerta': 'Producto correcto'},
 {'id': 27,
  'nombre': 'NAN 1 OPTIPRO Formula Infantil 12x400gMX',
  'bbox': [1763.24, 1342.7, 1991.45, 1666.97],
  'alerta': 'Producto mal acomodado'},
 {'id': 28,
  'nombre': 'DETERGENTE AZALEA MULTIUSOS 800G',
  'bbox': [206.09, 1941.73, 605.59, 2232.78],
  'alerta': 'Producto correcto'},
 {'id': 29,
  'nombre': 'Panales Tikytin 14pz T4',
  'bbox': [539.63, 1208.89, 854.02, 1680.44],
  'alerta': 'Producto correcto'},
 {'id': 30,
  'nombre': 'AGUA ALCALINA VITAWA 1LT',
  'bbox': [668.75, 290.24, 898.09, 968.07],
  'alerta': 'Producto correcto'},
 {'id': 31,
  'nombre': 'DETERGENTE AZALEA MULTIUSOS 800G',
  'bbox': [123.56, 2288.58, 551.74, 2358.94],
  'alerta': 'Producto correcto'},
 {'id': 32,
  'nombre': 'Papel Regio Rinde 4pz',
  'bbox': [239.92, 2690.97, 721.91, 3151.93],
  'alerta': 'Producto correcto'},
 {'id': 33,
  'nombre': 'NAN 2 OPTIPRO Formula Infantil 12x400gMX',
  'bbox': [],
  'alerta': 'Producto faltante'}]

      // const fakeResponse: ModelResult[] = [
      //   {
      //     id: "1",
      //     nombre: "Papel Regio Rinde 4pz",
      //     bbox: [30, 30, 60, 60],
      //     alerta: "Producto mal acomodado"
      //   },
      //   {
      //     id: "2",
      //     nombre: "Shampoo KleenBebe Manzanilla 250ml",
      //     bbox: [],
      //     alerta: "Producto faltante"
      //   },
      //   {
      //     id: "3",
      //     nombre: "Shampoo KleenBebe Manzanilla 250ml",
      //     bbox: [130, 130, 160, 160],
      //     alerta: "Producto correcto"
      //   },
      //   {
      //     id: "4",
      //     nombre: "Shampoo KleenBebe Manzanilla 250ml",
      //     bbox: [],
      //     alerta: "Producto faltante"
      //   }
      // ];

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