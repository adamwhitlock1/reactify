const SectionGrid = ({ artists }) => {
  console.log(artists)
  return (
    <>
      {artists && artists.length ? (
        <ul className="grid__list">
          {artists.map((artist, index) => {
            return (
            <li className="grid__item" key={ index }>
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