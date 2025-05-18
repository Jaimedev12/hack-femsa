import React from 'react';
import { CircleLoader } from 'react-spinners';

const LoadingScreen: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <CircleLoader color="#000" size={50} />
      <p>Processing your image...</p>
    </div>
  );
};

export default LoadingScreen;