import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from './providers/app-providers';
import { router } from './router/router';

import './styles/index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container "#root" not found');
}

createRoot(container).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
