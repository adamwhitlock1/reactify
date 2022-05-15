import axios from 'axios'

const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
}

const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
}

export const logout = () => {
  for (const prop in LOCALSTORAGE_KEYS) window.localStorage.removeItem(LOCALSTORAGE_KEYS[prop])

  window.location = window.location.origin
}

const hasTokenExpired = () => {
  const { accessToken, expireTime, timestamp } = LOCALSTORAGE_VALUES
  
  if ( !accessToken || !timestamp ) return false
  
  const elapsedTime = Date.now() - Number(timestamp)
  
  return (elapsedTime / 1000) > Number(expireTime)
}

const refreshToken = async () => {
  try {
    if ( !LOCALSTORAGE_VALUES.refreshToken || LOCALSTORAGE_VALUES.refreshToken === 'undefined' || (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000 ) {
      console.error('No refresh token available')
      logout();
    }

    const { data } = await axios.get(`/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`)

    window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token)
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now())
    
    console.log('stop!')
    window.location.reload()

  } catch(e) {
    console.error(e)
  }
}

const getAccessToken = () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
  }

  const hasError = urlParams.get('error')

  if ( hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === 
  'undefined') {
    refreshToken()
  }

  if ( LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined' ) return LOCALSTORAGE_VALUES.accessToken

  if ( queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    for (const param in queryParams) {
      window.localStorage.setItem(param, queryParams[param])
    }

    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now())

    return queryParams[LOCALSTORAGE_KEYS.accessToken]
  }

  return false
}

export const accessToken = getAccessToken()

axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
axios.defaults.headers['Content-Type'] = 'application/json'

export const getCurrentUserProfile = () => axios.get('/me')

export const getCurrentUserPlaylists = (limit = 20) => {
  return axios.get(`/me/playlists?limit=${limit}`)
}

export const getCurrentUserTopItems = (time_range = 'short_term', type = 'artists', limit = 10) => {
  return axios.get(`/me/top/${type}?time_range=${time_range}&limit=${limit}`)
}