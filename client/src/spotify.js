import axios from 'axios';

const baseURL = import.meta.env.VITE_API_ADDRESS;

console.log(baseURL);

axios.defaults.baseURL = baseURL;
axios.defaults.headers['Content-Type'] = 'application/json';

export const getCurrentUserProfile = () => axios.get('/me');

export const getCurrentUserPlaylists = (limit = 20) =>
  axios.get(`/me/playlists?limit=${limit}`);

export const getCurrentUserTopItems = (
  time_range = 'short_term',
  type = 'artists',
  limit = 10
) => axios.get(`/me/top/${type}?time_range=${time_range}&limit=${limit}`);
