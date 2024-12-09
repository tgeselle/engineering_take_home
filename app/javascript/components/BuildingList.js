import React, { useState } from 'react';
import { useBuildings } from '../contexts/BuildingContext';
import BuildingCard from './BuildingCard';
import BuildingForm from './BuildingForm';

const BuildingList = () => {
  const { buildings, loading, error } = useBuildings();
  const [showForm, setShowForm] = useState(false);

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    },
    addButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
    },
    loading: {
      textAlign: 'center',
      padding: '20px',
      color: '#666',
    },
    error: {
      color: '#ff0000',
      textAlign: 'center',
      padding: '20px',
    }
  };

  const handleFormSubmit = (newBuilding) => {
    setShowForm(false);
    // Recharger la liste des bâtiments
    window.location.reload();
  };

  if (loading) {
    return <div style={styles.loading}>Loading buildings...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      {showForm ? (
        <BuildingForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <div style={styles.header}>
            <h1 style={styles.title}>Buildings List</h1>
            <button
              style={styles.addButton}
              onClick={() => setShowForm(true)}
            >
              Add New Building
            </button>
          </div>
          <div style={styles.grid}>
            {buildings.map((building) => (
              <BuildingCard key={building.id} building={building} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BuildingList; 