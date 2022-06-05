import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { Header, Login, Profile, Me } from '@comps';
import { accessToken } from './spotify';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return (
    <div className="App">
      <Header token={token} />
      {!token ? (
        <Login />
      ) : (
        <Router>
          <ScrollToTop />

          <Routes>
            <Route path="/me" element={<Me />} />
            <Route path="/top-artists" element={<h1>Top Artists</h1>} />
            <Route path="/top-tracks" element={<h1>Top Tracks</h1>} />
            <Route path="/playlists/:id" element={<h1>Playlist</h1>} />
            <Route path="/playlists" element={<h1>Playlists</h1>} />
            <Route path="/" element={<Profile />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
