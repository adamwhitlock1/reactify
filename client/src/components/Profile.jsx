import { useState, useEffect } from 'react'
import { catchErrors } from '@src/utils'
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getCurrentUserTopItems
} from '@src/spotify'

import { SectionWrapper, SectionGrid } from '@comps'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [playlists, setPlaylists] = useState(null)
  const [topArtists, setTopArtists] = useState(null)

  useEffect(() => {

    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile()
      setProfile(userProfile.data)
      
      const userPlaylists = await getCurrentUserPlaylists()
      setPlaylists(userPlaylists.data)
      
      const userTopArtists = await getCurrentUserTopItems()
      setTopArtists(userTopArtists.data)
    }

    console.log(topArtists)

    catchErrors(fetchData())
    
  }, [])

  return (
    <>
      {profile && (
        <section className="[ section__profile ]">
          <div className="[ content__wrapper ]">
            {profile.images.length && profile.images[0].url && (
              <div className="[ profile__image ]">
                <img src={ profile.images[0].url } alt="Spotify user profile image" />
              </div>
            )}
            <div className="profile__info">
              <h2>user profile</h2>
              <h1>{ profile.display_name }</h1>
              <div className="profile__stats">
                {playlists && (
                  <p>{ playlists.total } Public Playlist{playlists.total !== 1 ? 's' : ''}</p>
                )}
                <div className="separator"></div>
                <p>{ profile.followers.total } Follower{profile.followers.total !== 1 ? 's' : ''}</p>
                <div className="separator"></div>
                <a href={ profile.external_urls.spotify } target="_blank">Visit User Profile</a>
              </div>
              {/* <pre style={{ color: 'white' }}>{ JSON.stringify(profile, null, 2) }</pre> */}
              {/* <pre style={{ color: 'white' }}>{ JSON.stringify(playlists, null, 2) }</pre> */}
            </div>
          </div>
        </section>
      )}

      {topArtists && (
        <main>
          <SectionWrapper
            sectionId="section__top-artists"
            title="Top Artists of the Month"
            seeAllLink="/top-artists">
            <SectionGrid artists={ topArtists.items.slice(0, 8) }></SectionGrid>
          </SectionWrapper>
        </main>
      )}
    </>
  )
}

export default Profile