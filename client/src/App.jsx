import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <a className="button" href="http://localhost:8888/login">Login To Spotify</a>
    </div>
  )
}

export default App
