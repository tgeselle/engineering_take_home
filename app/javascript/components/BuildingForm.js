import React, { useState, useEffect } from 'react';
import { useBuildings } from '../contexts/BuildingContext';

const BuildingForm = ({ onSubmit, onCancel, building = null }) => {
  const { createBuilding, updateBuilding, customFields, standardFields } = useBuildings();
  const [formData, setFormData] = useState({
    address: '',
    state: '',
    zipcode: '',
    client_id: '',
    custom_fields: {}
  });

  useEffect(() => {
    if (building) {
      const customFieldsData = {};
      Object.entries(building).forEach(([key, value]) => {
        if (!standardFields.includes(key)) {
          customFieldsData[key] = value;
        }
      });

      setFormData({
        address: building.address || '',
        state: building.state || '',
        zipcode: building.zipcode || '',
        client_id: building.client_id?.toString() || '',
        custom_fields: customFieldsData
      });
    }
  }, [building, standardFields]);

  const styles = {
    form: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '0 auto',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
      textAlign: 'center',
    },
    field: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#555',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
      justifyContent: 'flex-end',
    },
    button: {
      padding: '10px 20px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    submitButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    cancelButton: {
      backgroundColor: '#f5f5f5',
      color: '#333',
    },
    customFieldsSection: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = building
        ? await updateBuilding(building.id, formData)
        : await createBuilding(formData);
      onSubmit(result);
    } catch (error) {
      console.error('Error saving building:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('custom_field_')) {
      const fieldName = name.replace('custom_field_', '');
      setFormData(prev => ({
        ...prev,
        custom_fields: {
          ...prev.custom_fields,
          [fieldName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatFieldName = (fieldName) => {
    return fieldName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>
        {building ? 'Edit Building' : 'Add New Building'}
      </h2>
      
      <div style={styles.field}>
        <label style={styles.label}>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Zipcode</label>
        <input
          type="text"
          name="zipcode"
          value={formData.zipcode}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Client ID</label>
        <input
          type="number"
          name="client_id"
          value={formData.client_id}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      {customFields.length > 0 && (
        <div style={styles.customFieldsSection}>
          <h3 style={{...styles.label, marginBottom: '15px'}}>Custom Fields</h3>
          {customFields.map((fieldName) => (
            <div key={fieldName} style={styles.field}>
              <label style={styles.label}>{formatFieldName(fieldName)}</label>
              <input
                type="text"
                name={`custom_field_${fieldName}`}
                value={formData.custom_fields[fieldName] || ''}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          ))}
        </div>
      )}

      <div style={styles.buttonContainer}>
        <button
          type="button"
          onClick={onCancel}
          style={{...styles.button, ...styles.cancelButton}}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{...styles.button, ...styles.submitButton}}
        >
          {building ? 'Update Building' : 'Create Building'}
        </button>
      </div>
    </form>
  );
};

export default BuildingForm; 