import { Link } from 'react-router-dom'

const PlaylistGrid = ({ playlists }) => {
  return (
    <>
      {playlists && playlists.length ? (
        <ul className="grid__list">
          {playlists.map((playlist, index) => {
            return (
              <li className="grid__item" key={ index }>
                <Link className="grid__item--inner" to={`/playlists/${playlist.id}`}>
                  {playlist.images.length && playlist.images[0] && (
                    <div className="grid__item--img">
                      <img src={ playlist.images[0].url } alt={ playlist.name } />
                    </div>
                  )}
                  <h3 className="grid__item--name">{ playlist.name }</h3>
                  <h3 className="grid__item--label">{ playlist.type }</h3>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="alert__empty">No artists available</p>
      )}
    </>
  )
}

export default PlaylistGrid