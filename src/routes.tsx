import App from './App';
import { createBrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import Group from './pages/Group';
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
    path: '/group/:id',
    element: <LoginProtected component={Group} />
  },
  // {
  //   path: '/group/create',
  //   element: <LoginProtected component={Group} />
  // },
  {
    path: '*',
    element: (
      <div>
        <p>404 - Page not found</p>
      </div>
    )
  }
]);
