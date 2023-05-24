import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Layout from './components/Layout';

function App() {
  return (
    <div className="App">
      <Layout>
        <p>This is a test statement</p>
      </Layout>
    </div>
  );
}

export default App;
