import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import LocalSignalHeader from './LocalSignalHeader.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <LocalSignalHeader />
  </React.StrictMode>
);
