import './styles/global.css';
import React from 'react';
import router from './routes';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

// eslint-disable-next-line unicorn/prefer-query-selector
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
