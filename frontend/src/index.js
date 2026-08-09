// Entry point for the React app. Mounts <App /> into #root and imports the
// ReactFlow stylesheet plus this app's global stylesheet (index.css).
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'reactflow/dist/style.css';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
