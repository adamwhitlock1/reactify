import { useState, useEffect } from 'react'
import { getTrackId, getTrackLyrics } from '@src/musixmatch'

const Lyrics = ({ trackId }) => {
  const [musixId, setMusixId] = useState(null)
  const [musixLyrics, setMusixLyrics] = useState(null)

  useEffect(() => {
    const fetchLyrics = async () => {
      if ( musixId ) {
        const resLyrics = await getTrackLyrics(musixId)
        console.log(resLyrics)
        setMusixLyrics(resLyrics.data.message.body.lyrics)
      }
    }
    
    fetchLyrics()
  }, [musixId])
  
  const fetchTrackData = async (id) => {
    const resId = await getTrackId(id)
    setMusixId(resId.data.message.body.track.track_id)
  }
  
  return (
    <>
      <button
        onClick={ () => fetchTrackData(trackId) }
        className="lyrics__link">
        view lyrics
      </button>

        {musixLyrics && (
          <div className="lyrics__modal">
            {musixLyrics.lyrics_body ? (
              <pre className="lyrics__content">{ musixLyrics.lyrics_body }</pre>
            ) : (
              <pre className="lyrics__content">{ musixLyrics.lyrics_copyright }</pre>
            )}
          </div>
        )}
    </>
  )
}

export default Lyrics