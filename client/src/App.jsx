import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { Header, Profile, Me } from '@comps';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="App">
      <Header />
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
    </div>
  );
}

export default App;
