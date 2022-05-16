const SectionGrid = ({ artists }) => {
  return (
    <>
      {artists && artists.length ? (
        <ul className="grid__list" data-type="artists">
          {artists.map((artist, index) => {
            return (
              <a href={ artist.external_urls.spotify } target="_blank" key={ index }>
                <li className="grid__item">
                  <div className="grid__item--inner">
                    {artist.images[0] && (
                      <div className="grid__item--img">
                        <img src={ artist.images[0].url } alt={ artist.name } />
                      </div>
                    )}
                    <h3 className="grid__item--name">{ artist.name }</h3>
                    <p className="grid__item--label">{ artist.type }</p>
                  </div>
                </li>
              </a>
              )
          })}
        </ul>
      ) : (
        <p className="alert__empty">No artists available</p>
      )}
  </>
  )
}

export default SectionGrid