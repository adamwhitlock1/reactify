import { formatTrackDuration } from "../utils"

const TrackList = ({ tracks }) => {
  return (
    <>
    {tracks && tracks.length ? (
      <ul className="track__list">
        {tracks.map((track, index) => {
          return (
            <li className="track__item" key={ index }>
              <div className="track__number">
                <p>{ index + 1 }</p>
              </div>
              
              <div className="track__info">
                {track.album.images.length && track.album.images[2] && (
                  <div className="track__details--img">
                    <a href={ track.external_urls.spotify } target="_blank">
                      <img src={ track.album.images[2].url } alt={ track.title } />
                    </a>
                  </div>
                )}
                
                <div className="track__details">
                  <a href={ track.external_urls.spotify } target="_blank">
                    <p className="track__name">{track.name}</p>
                  </a>

                  <a href={ track.artists[0].external_urls.spotify } target="_blank">
                    <p className="track__artist">
                      {track.explicit && (<span className="explicit">E</span>)}
                      {track.artists.map((artist, index) => {
                        return (
                          <span className="artist__name" key={ index }>
                            { artist.name }{ index !== track.artists.length - 1 && ', '}
                          </span>
                        )
                      })}
                    </p>
                  </a>
                </div>
              </div>

              <div className="track__album">
                <a href={ track.album.external_urls.spotify } target="_blank">
                  <p>{ track.album.name }</p>
                </a>
              </div>
              
              <div className="track__duration">
                <p>{ formatTrackDuration(track.duration_ms) }</p>
              </div>
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