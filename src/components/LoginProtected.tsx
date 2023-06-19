import { ComponentType, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../lib/store';

interface ProtectedRouteProps {
  component: ComponentType;
}

const ProtectedRoute = ({ component: Component }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.token.value);
  useEffect(() => {
    if (!token) navigate('/');
  }, [token, navigate]);
  return <Component />;
};

export default ProtectedRoute;
