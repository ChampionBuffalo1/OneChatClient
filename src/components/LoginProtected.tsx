import { ComponentType, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  component: ComponentType;
}

const ProtectedRoute = ({ component: Component }: ProtectedRouteProps) => {
  const [render, setRender] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      setRender(true);
    }
  }, [navigate]);
  return <>{render ? <Component /> : <></>}</>;
};

export default ProtectedRoute;
