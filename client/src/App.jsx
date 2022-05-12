import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const accessToken = urlParams.get('access_token')
    const refreshToken = urlParams.get('refresh_token')

    console.log(accessToken)
    console.log(refreshToken)
  })

  return (
    <div className="App">
      <a className="button" href="http://localhost:8888/login">Login To Spotify</a>
    </div>
  )
}

export default App
