// Entry point for the build script in your package.json
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BuildingProvider } from './contexts/BuildingContext';
import BuildingList from './components/BuildingList';

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('react-root');
  const root = createRoot(node);

  if (node) {
    root.render(
      <BuildingProvider>
        <BuildingList />
      </BuildingProvider>
    );
  }
});
