import { useNavigate } from 'react-router-dom';
import { SocketProvider } from './socket-provider';
import { ComponentType, useEffect, useState } from 'react';

interface ProtectedRouteProps {
  component: ComponentType;
}

const ProtectedRoute = ({ component: Component }: ProtectedRouteProps) => {
  const [render, setRender] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setRender(true);
    } else {
      navigate('/');
    }
  }, [navigate]);
  return render ? (
    <SocketProvider>
      <Component />
    </SocketProvider>
  ) : (
    <></>
  );
};

export default ProtectedRoute;
