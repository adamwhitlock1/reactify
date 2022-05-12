require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
const port = 8888

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI

const generateRandomString = length => {
  let text
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  
  for ( let i = 0; i < length; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.lenght))
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
  const scope = 'user-read-private user-read-email'
  
  const loginparams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  })
  
  const queryParams = loginparams.toString()
  res.cookie(stateKey, state)
  
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`)
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
      
      const { access_token, token_type } = response.data
      
      const { refresh_token } = response.data

      axios.get(`http://localhost:8888/refresh_token?refresh_token=${refresh_token}`)

      .then(response => {
        res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`)
      })

      .catch(error => res.send(error))

    } else res.send(response)
  })

  .catch(error => res.send(error))
})

//REFRESH TOKEN
app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query

  const refreshparams = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh_token
  })

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: refreshparams.toString(),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  })

  .then(response => res.send(response.data))

  .catch(error => res.send(error))
})


app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`)
})