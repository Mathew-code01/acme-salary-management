// client/src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App';
import { AppErrorBoundary } from './app/error-boundary';
import { Providers } from './app/providers';

import './index.css';
import './App.css';

const ROOT_ELEMENT_ID = 'root';

const rootElement = document.getElementById(ROOT_ELEMENT_ID);

if (!rootElement) {
  throw new Error(`Application root element (#${ROOT_ELEMENT_ID}) was not found.`);
}

createRoot(rootElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <Providers>
        <App />
      </Providers>
    </AppErrorBoundary>
  </StrictMode>,
);
