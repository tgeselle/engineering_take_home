import React from 'react';

const BuildingCard = ({ building }) => {
  const styles = {
    card: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease',
      cursor: 'pointer',
    },
    address: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
    },
    details: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px',
    },
    section: {
      marginTop: '10px',
      padding: '10px 0',
      borderTop: '1px solid #eee',
    },
    label: {
      fontWeight: 'bold',
      marginRight: '5px',
      color: '#555',
    },
    value: {
      color: '#666',
    },
    customField: {
      marginBottom: '5px',
    }
  };

  const customFields = Object.keys(building).filter(key => 
    !['id', 'client_name', 'address', 'state', 'zipcode'].includes(key)
  );

  return (
    <div style={styles.card}>
      <div style={styles.address}>{building.address}</div>
      <div style={styles.details}>{building.state}, {building.zipcode}</div>
      
      <div style={styles.section}>
        <span style={styles.label}>Client:</span>
        <span style={styles.value}>{building.client_name}</span>
      </div>

      <div style={styles.section}>
        {customFields.map((field) => (
          <div key={field} style={styles.customField}>
            <span style={styles.label}>{field}:</span>
            <span style={styles.value}>{building[field]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuildingCard; 