import { useState, useEffect } from 'react'
import axios from 'axios'
import { formatTrackDuration } from '@src/utils'
import { getTrackId, getTrackLyrics } from '@src/musixmatch'

const TrackList = ({ tracks }) => {
  const [trackId, setTrackId] = useState(null)
  const [trackLyrics, setTrackLyrics] = useState(null)

  useEffect(() => {
    console.log('TrackId changed', trackId)

    if (trackId) {
      axios
        .get(`http://localhost:8888/track_lyrics?track_id=${trackId}`)
        .then(res => {
          const resLyrics = res.data.message.body.lyrics.lyrics_body
          console.log(resLyrics)
          setTrackLyrics(resLyrics)
        })
    }
  }, [trackId])

  const fetchTrackData = (id) => {
    axios
      .get(`http://localhost:8888/track_id?track_isrc=${id}`)
      .then(res => {
        const resId = res.data.message.body.track.track_id
        setTrackId(resId)

      })
  }

  return (
    <>
      {tracks && tracks.length ? (
        <ul className="track__list">
          {tracks.map((track, index) => {
            return (
              <li className="track__item" key={index}>
                <div className="track__number">
                  <p>{index + 1}</p>
                </div>

                <div className="track__info">
                  {track.album.images.length && track.album.images[2] && (
                    <div className="track__details--img">
                      <a href={track.external_urls.spotify} target="_blank">
                        <img src={track.album.images[2].url} alt={track.title} />
                      </a>
                    </div>
                  )}

                  <div className="track__details">
                    <div className="track__title">
                      <a href={track.external_urls.spotify} target="_blank">
                        <p className="track__name">{track.name}</p>
                      </a>

                      <span className="track__separator">—</span>

                      <button onClick={() => fetchTrackData(track.external_ids.isrc)} className="lyrics__link">view lyrics</button>
                    </div>

                    <a href={track.artists[0].external_urls.spotify} target="_blank">
                      <p className="track__artist">
                        {track.explicit && (<span className="explicit">E</span>)}
                        {track.artists.map((artist, index) => {
                          return (
                            <span className="artist__name" key={index}>
                              {artist.name}{index !== track.artists.length - 1 && ', '}
                            </span>
                          )
                        })}
                      </p>
                    </a>
                  </div>
                </div>

                <div className="track__album">
                  <a href={track.album.external_urls.spotify} target="_blank">
                    <p>{track.album.name}</p>
                  </a>
                </div>

                <div className="track__duration">
                  <p>{formatTrackDuration(track.duration_ms)}</p>
                </div>

                {trackLyrics && <pre className='text-white'>{trackLyrics}</pre>}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="alert__empty">No tracks available</p>
      )}
    </>
  )
}

export default TrackList