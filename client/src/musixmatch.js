import axios from 'axios'

export const getTrackId = (id) => {
  return axios.get(`http://localhost:8888/track_id?track_isrc=${id}`)
}

export const getTrackLyrics = (id) => {
  return axios.get(`http://localhost:8888/track_lyrics?track_id=${id}`)
}