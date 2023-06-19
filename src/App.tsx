import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Connect to websockets in here
    const token = localStorage.getItem('token');
    navigate(token ? '/home' : '/login');
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="animate-bounce text-3xl bold">OneChat Loading...</p>
    </div>
  );
}

export default App;
