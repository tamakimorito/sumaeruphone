
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';

// Register the service worker to enable PWA features like installation.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('Service Worker registered successfully:', registration);
    }).catch(error => {
      console.error('Service Worker registration failed:', error);
    });
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}