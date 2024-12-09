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
      const response = await fetch('/api/v1/buildings?per_page=9');
      const data = await response.json();
      const buildingsData = data.buildings;
      setBuildings(buildingsData);
      setCustomFields(extractCustomFields(buildingsData));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch buildings');
      setLoading(false);
    }
  };

  const createBuilding = async (buildingData) => {
    try {
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

      if (!response.ok) {
        throw new Error('Failed to create building');
      }

      const newBuilding = await response.json();
      setBuildings([...buildings, newBuilding]);
      return newBuilding;
    } catch (err) {
      setError('Failed to create building');
      throw err;
    }
  };

  const updateBuilding = async (id, buildingData) => {
    try {
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

      if (!response.ok) {
        throw new Error('Failed to update building');
      }

      const data = await response.json();
      const updatedBuilding = data.building;

      setBuildings(prevBuildings => 
        prevBuildings.map(building => 
          building.id === id ? updatedBuilding : building
        )
      );

      return updatedBuilding;
    } catch (err) {
      setError('Failed to update building');
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
        standardFields: STANDARD_FIELDS
      }}
    >
      {children}
    </BuildingContext.Provider>
  );
};

export const useBuildings = () => useContext(BuildingContext); 