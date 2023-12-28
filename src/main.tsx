import './styles/global.css';
import React from 'react';
import router from './routes';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { reduxStore } from './lib/store';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient();
// eslint-disable-next-line unicorn/prefer-query-selector
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer autoClose={2000} closeOnClick draggable theme="dark" />
        <Provider store={reduxStore}>
          <RouterProvider router={router} />
        </Provider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
