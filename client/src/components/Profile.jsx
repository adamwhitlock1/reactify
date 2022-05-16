import { useState, useEffect } from 'react'
import { catchErrors } from '@src/utils'
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getCurrentUserTopItems
} from '@src/spotify'

import { SectionWrapper, SectionGrid, TrackList } from '@comps'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [playlists, setPlaylists] = useState(null)
  const [topArtists, setTopArtists] = useState(null)
  const [topTracksLong, setTopTracksLong] = useState(null)
  const [topTracksShort, setTopTracksShort] = useState(null)
  const [useLong, setUseLong] = useState(null)

  useEffect(() => {
    setUseLong(true)

    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile()
      setProfile(userProfile.data)
      
      const userPlaylists = await getCurrentUserPlaylists()
      setPlaylists(userPlaylists.data)
      
      const userTopArtists = await getCurrentUserTopItems('short_term', 'artists', 8)
      setTopArtists(userTopArtists.data)
      
      const userTopTracksLong = await getCurrentUserTopItems('long_term', 'tracks', 10)
      setTopTracksLong(userTopTracksLong.data)
      
      const userTopTracksShort = await getCurrentUserTopItems('short_term', 'tracks', 10)
      setTopTracksShort(userTopTracksShort.data)
    }

    catchErrors(fetchData())
    
  }, [])

  const computedTrackTitle = `Top Tracks of ${useLong === true ? 'All Time' : 'the Month'}`

  return (
    <div className="site__wrapper">
      {profile && (
        <section className="[ section__profile ]">
          <div className="[ content__wrapper ]">
            {profile.images.length && profile.images[0].url && (
              <div className="[ profile__image ]">
                <img src={ profile.images[0].url } alt="Spotify user profile image" />
              </div>
            )}
            <div className="[ profile__info ]">
              <h2>user profile</h2>
              <h1>{ profile.display_name }</h1>
              <div className="[ profile__stats ]">
                {playlists && (
                  <p>{ playlists.total } Public Playlist{playlists.total !== 1 ? 's' : ''}</p>
                )}
                <div className="[ separator ]"></div>
                <p>{ profile.followers.total } Follower{profile.followers.total !== 1 ? 's' : ''}</p>
                <div className="[ separator ]"></div>
                <a href={ profile.external_urls.spotify } target="_blank">Visit User Profile</a>
              </div>
            </div>
          </div>
        </section>
      )}

      {topArtists && topTracksLong && (
        <main>
          <SectionWrapper
            sectionId="section__top-artists"
            title="Top Artists of the Month"
            seeAllLink="/top-artists">
            <SectionGrid artists={ topArtists.items }></SectionGrid>
          </SectionWrapper>
          
          <SectionWrapper
            sectionId="section__top-tracks"
            title={ computedTrackTitle }
            seeAllLink="/top-tracks">
              <div className="time__toggle">
                <button
                  onClick={ () => setUseLong(true) }
                  className={ useLong === true ? 'active' : '' }
                  data-button="select">
                    All Time
                  </button>
                <button
                  onClick={ () => setUseLong(false) }
                  className={ useLong === false ? 'active' : ''}
                  data-button="select">
                    This Month
                  </button>
              </div>
              <TrackList tracks={ useLong === true ? topTracksLong.items : topTracksShort.items }></TrackList>
          </SectionWrapper>
        </main>
      )}
    </div>
  )
}

export default Profile