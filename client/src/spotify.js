import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8888';
axios.defaults.headers['Content-Type'] = 'application/json';

export const getCurrentUserProfile = () => axios.get('/me');

export const getCurrentUserPlaylists = (limit = 20) =>
  axios.get(`/me/playlists?limit=${limit}`);

export const getCurrentUserTopItems = (
  time_range = 'short_term',
  type = 'artists',
  limit = 10
) => axios.get(`/me/top/${type}?time_range=${time_range}&limit=${limit}`);
