import React, { createContext, useState, useContext, useEffect } from 'react';

export const BuildingContext = createContext();

const STANDARD_FIELDS = ['id', 'client_id', 'client_name', 'address', 'state', 'zipcode'];

export const BuildingProvider = ({ children }) => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customFields, setCustomFields] = useState(new Set());

  const extractCustomFields = (buildingsData) => {
    const fields = new Set();
    buildingsData.forEach(building => {
      Object.keys(building).forEach(key => {
        if (!STANDARD_FIELDS.includes(key)) {
          fields.add(key);
        }
      });
    });
    return Array.from(fields);
  };

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/v1/buildings?per_page=9');
      if (!response.ok) {
        throw new Error('Failed to fetch buildings');
      }
      const data = await response.json();
      const buildingsData = data.buildings;
      setBuildings(buildingsData);
      setCustomFields(extractCustomFields(buildingsData));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching buildings:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBuilding = async (buildingData) => {
    try {
      setError(null);
      const { custom_fields, ...buildingInfo } = buildingData;
      const payload = {
        building: buildingInfo,
        custom_fields
      };

      const response = await fetch('/api/v1/buildings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.join(', ') || 'Failed to create building');
      }

      await fetchBuildings(); // Rafraîchir la liste complète
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating building:', err);
      throw err;
    }
  };

  const updateBuilding = async (id, buildingData) => {
    try {
      setError(null);
      const { custom_fields, ...buildingInfo } = buildingData;
      const payload = {
        building: buildingInfo,
        custom_fields
      };

      const response = await fetch(`/api/v1/buildings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.join(', ') || 'Failed to update building');
      }

      const updatedBuilding = data.building;

      setBuildings(prevBuildings => 
        prevBuildings.map(building => 
          building.id === id ? updatedBuilding : building
        )
      );

      return updatedBuilding;
    } catch (err) {
      setError(err.message);
      console.error('Error updating building:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  return (
    <BuildingContext.Provider 
      value={{ 
        buildings, 
        loading, 
        error, 
        createBuilding,
        updateBuilding,
        customFields,
        standardFields: STANDARD_FIELDS,
        refreshBuildings: fetchBuildings
      }}
    >
      {children}
    </BuildingContext.Provider>
  );
};

export const useBuildings = () => useContext(BuildingContext); 