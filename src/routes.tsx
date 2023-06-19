import App from './App';
import { createBrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import Authentication from './pages/Authentication';
import LoginProtected from './components/LoginProtected';

export default createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: <Authentication type="login" />
  },
  {
    path: '/signup',
    element: <Authentication type="signup" />
  },
  {
    path: '/home',
    element: <LoginProtected component={Home} />
  },
  {
    path: '*',
    element: (
      // TODO: make a 404 page
      <div>
        <p>404 - Page not found</p>
      </div>
    )
  }
]);
