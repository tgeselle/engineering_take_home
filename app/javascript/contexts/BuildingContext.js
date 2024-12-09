import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for managing building-related state and operations
export const BuildingContext = createContext();

// Define standard fields that are common to all buildings
const STANDARD_FIELDS = ['id', 'client_id', 'client_name', 'address', 'state', 'zipcode'];

export const BuildingProvider = ({ children }) => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customFields, setCustomFields] = useState(new Set());

  // Extract custom fields from buildings data by filtering out standard fields
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

  // Fetch all buildings from the API
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

  // Create a new building and refresh the list
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

      await fetchBuildings(); // Refresh the complete list
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating building:', err);
      throw err;
    }
  };

  // Update an existing building
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

      // Update the local state with the new building data
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

  // Fetch buildings on component mount
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

// Custom hook to access the building context
export const useBuildings = () => useContext(BuildingContext); 