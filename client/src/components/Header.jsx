import logo from '@img/logo.png'
import Social from '@comps/Social'
import { logout } from '@src/spotify'

const Header = ({ token }) => {
  return (
    <header>
      <div className="[ filler ]">
        {token && (
          <button className="button" onClick={ logout } data-button="logout">Sign Out of Spotify</button>
        )

        }
      </div>
      <div className="[ logo ]">
        <img src={ logo } alt="site logo" />
      </div>
      <div className="[ social ]">
        <Social />
      </div>
    </header>
  )
}

export default Header