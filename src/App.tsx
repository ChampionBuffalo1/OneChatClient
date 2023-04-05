import './App.css'
import reactLogo from './assets/react.svg'
import { useState } from 'react'
import viteLogo from '/vite.svg'
import Image from './components/Image'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Helmet>
        <title>Main Page of the app</title>
      </Helmet>
      <div>
        <Link to="https://vitejs.dev" target="_blank">
          <Image src={viteLogo} className="logo" alt="Vite logo" />
        </Link>
        <Link to="https://reactjs.org" target="_blank">
          <Image src={reactLogo} className="logo react" alt="React logo" />
        </Link>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
