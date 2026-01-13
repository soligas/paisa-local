import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Use named import for App as the component is likely exported as a named export
import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("No se pudo encontrar el elemento root para montar la aplicación.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);