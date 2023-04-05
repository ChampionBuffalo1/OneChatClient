import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <Helmet>
        <title>Main Page of the app</title>
      </Helmet>
      <div>
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <Link to="/about">
          Link to about page
        </Link>
      </div>
    </div>
  );
}

export default App;
