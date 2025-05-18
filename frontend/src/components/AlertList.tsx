import React from 'react';
import type { BoundingBox } from './ResultsComponent';

interface AlertsListProps {
  boxes: BoundingBox[];
}

const AlertList: React.FC<AlertsListProps> = ({ boxes }) => {
  return (
    <div style={{ 
      width: '50vw',
      height: '100%',
      overflow: 'auto',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h2>Alerts</h2>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {boxes.map((box) => (
          <li 
            key={box.id}
            style={{
              padding: '10px',
              margin: '10px 0',
              backgroundColor: '#f5f5f5',
              borderLeft: '4px solid red',
              borderRadius: '4px'
            }}
          >
            <strong>ID: {box.id}</strong><br/>
            {box.alert}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertList;