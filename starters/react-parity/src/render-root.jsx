import {createRoot} from 'react-dom/client';
import React from 'react';

export function renderRoot(Component) {
  const rootElement = document.getElementById('app');
  if (!rootElement) {
    throw new Error('Missing #app mount root.');
  }

  createRoot(rootElement).render(<Component />);
}
