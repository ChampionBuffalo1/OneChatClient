import { useEffect } from 'react';
import { setToken } from './lib/reducers/token';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './lib/hooks';

function App() {
  const token = useAppSelector(state => state.token.value);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      const localToken = localStorage.getItem('token');
      if (localToken) {
        dispatch(setToken(localToken));
        navigate('/home');
      } else {
        navigate('/login');
      }
    }
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="animate-bounce text-3xl bold">OneChat Loading...</p>
    </div>
  );
}

export default App;
