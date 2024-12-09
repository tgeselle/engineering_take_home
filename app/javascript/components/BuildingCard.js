import React, { useState } from 'react';
import BuildingForm from './BuildingForm';

// Define the standard fields that are displayed separately from custom fields
const STANDARD_FIELDS = ['id', 'client_name', 'address', 'state', 'zipcode'];

const BuildingCard = ({ building }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Styles for the building card component
  const styles = {
    card: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease',
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
    },
    editButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      marginTop: '10px',
      width: '100%',
    }
  };

  // Convert snake_case field names to Title Case for display
  const formatFieldName = (fieldName) => {
    return fieldName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleEditSubmit = () => {
    setIsEditing(false);
    // List update is handled by the context
  };

  // Filter out standard fields to get custom fields
  const customFields = Object.entries(building).filter(([key]) => !STANDARD_FIELDS.includes(key));

  // Render the edit form when in editing mode
  if (isEditing) {
    return <BuildingForm 
      building={building}
      onSubmit={handleEditSubmit}
      onCancel={() => setIsEditing(false)}
    />;
  }

  // Render the building card with all information
  return (
    <div style={styles.card}>
      <div style={styles.address}>{building.address}</div>
      <div style={styles.details}>{building.state}, {building.zipcode}</div>
      
      <div style={styles.section}>
        <span style={styles.label}>Client:</span>
        <span style={styles.value}>{building.client_name}</span>
      </div>

      {customFields.length > 0 && (
        <div style={styles.section}>
          {customFields.map(([fieldName, value]) => (
            <div key={fieldName} style={styles.customField}>
              <span style={styles.label}>{formatFieldName(fieldName)}:</span>
              <span style={styles.value}>{value}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsEditing(true)}
        style={styles.editButton}
      >
        Edit Building
      </button>
    </div>
  );
};

export default BuildingCard; 