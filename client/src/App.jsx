import axios from 'axios'
import { accessToken } from './spotify'
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import { Header, Login, Profile } from '@comps'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  const [token, setToken] = useState(null)

  useEffect(() => {
    setToken(accessToken)
  }, [])

  return (
    <div className="App">
      <Header token={ token }/>
      {!token ? (
          <Login />
        ) : (
            <Router>
              <ScrollToTop />
              
              <Routes>
                <Route path="/top-artists" element={
                  <h1>Top Artists</h1>
                }>
                  <>
                  </>
                </Route>
                <Route path="/top-tracks" element={
                  <h1>Top Tracks</h1>
                }>
                  <>
                  </>
                </Route>
                <Route path="/playlists/:id" element={
                  <h1>Playlist</h1>
                }>
                  <>
                  </>
                </Route>
                <Route path="/playlists" element={
                  <h1>Playlists</h1>
                }>
                  <>
                  </>
                </Route>
                <Route path="/" element={ <Profile /> }>
                </Route>
              </Routes>
            </Router>
        )}
    </div>
  )
}

export default App
