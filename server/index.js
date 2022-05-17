require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const port = 8888

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const MUSIXMATCH_API =process.env.MUSIXMATCH_API

const lyricBaseURL = "https://api.musixmatch.com/ws/1.1"

app.use(cors())

const generateRandomString = length => {
  let text
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  
  for ( let i = 0; i < length; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  
  return text
}


app.get('/', (req, res) => {
  const jsonData = {
    name: 'Craig',
    age: 40
  }
  
  res.json(jsonData)
})

//LOGIN
app.get('/login', (req, res) => {
  const stateKey = 'spotify_auth_state'
  const state = generateRandomString(16)
  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
  ].join(' ')
  
  const loginparams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  }).toString()
  
  res.cookie(stateKey, state)
  
  res.redirect(`https://accounts.spotify.com/authorize?${loginparams}`)
})

//CALLBACK
app.get('/callback', (req, res) => {
  const code = req.query.code || null

  const callbackparams = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI
  })
  
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: callbackparams.toString(),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
    },
  })

  .then(response => {
    if ( response.status === 200 ) {
      
      const { access_token, refresh_token, expires_in } = response.data
      
      const refreshparams = new URLSearchParams({
        access_token,
        refresh_token,
        expires_in,
      }).toString()

      
      res.redirect(`http://localhost:3000/?${refreshparams}`)
      
    } else {

      const errorparams = new URLSearchParams({
        error: 'invalid_token'
      }).toString()

      res.redirect(`/?${errorparams}`)
    }
  })

  .catch(error => res.send(error))
})

//REFRESH TOKEN
app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query

  const refreshparams = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh_token
  }).toString()

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: refreshparams,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  })

  .then(response => res.send(response.data))

  .catch(error => res.send(error))
})

//HANDLE LYRICS REQUESTS
app.get('/track_id', (req, res) => {
  const { track_isrc } = req.query

  const getTrack = async () => {
    try {
      const response = await axios.get(`${lyricBaseURL}/track.get?apikey=${MUSIXMATCH_API}&track_isrc=${track_isrc}`)
      res.send(response.data)
    } catch(error) {
      res.send(error)
    }
  }

  getTrack()
})

app.get('/track_lyrics', (req, res) => {
  const { track_id } = req.query

  const getTrack = async () => {
    try {
      const response = await axios.get(`${lyricBaseURL}/track.lyrics.get?apikey=${MUSIXMATCH_API}&track_id=${track_id}`)
      res.send(response.data)
    } catch(error) {
      res.send(error)
    }
  }

  getTrack()
})


app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`)
})