import './styles/global.css';
import React from 'react';
import router from './routes';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { reduxStore } from './lib/store';

const queryClient = new QueryClient();
// eslint-disable-next-line unicorn/prefer-query-selector
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={reduxStore}>
          <RouterProvider router={router} />
        </Provider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
