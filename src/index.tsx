import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import LayoutConfigureProvider from './context/LayoutConfigureContext';
import './styles/global.css';

ReactDOM.render(
  <React.StrictMode>
    <LayoutConfigureProvider>
      <App />
    </LayoutConfigureProvider>
  </React.StrictMode>,
  document.getElementById('root')
);