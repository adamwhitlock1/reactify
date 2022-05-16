import { useState, useEffect } from 'react'
import { catchErrors } from '@src/utils'
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getCurrentUserTopItems
} from '@src/spotify'

import { SectionWrapper, ArtistGrid, TrackList, PlaylistGrid } from '@comps'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [playlists, setPlaylists] = useState(null)
  
  const [topArtistsLong, setTopArtistsLong] = useState(null)
  const [topArtistsShort, setTopArtistsShort] = useState(null)
  const [useArtistsLong, setUseArtistsLong] = useState(null)
  
  const [topTracksLong, setTopTracksLong] = useState(null)
  const [topTracksShort, setTopTracksShort] = useState(null)
  const [useTracksLong, setUseTracksLong] = useState(null)

  useEffect(() => {
    setUseTracksLong(true)
    setUseArtistsLong(false)

    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile()
      setProfile(userProfile.data)
      
      const userPlaylists = await getCurrentUserPlaylists()
      setPlaylists(userPlaylists.data)
      
      const userTopArtistsLong = await getCurrentUserTopItems('long_term', 'artists', 8)
      setTopArtistsLong(userTopArtistsLong.data)
      
      const userTopArtistsShort = await getCurrentUserTopItems('short_term', 'artists', 8)
      setTopArtistsShort(userTopArtistsShort.data)
      
      const userTopTracksLong = await getCurrentUserTopItems('long_term', 'tracks', 10)
      setTopTracksLong(userTopTracksLong.data)
      
      const userTopTracksShort = await getCurrentUserTopItems('short_term', 'tracks', 10)
      setTopTracksShort(userTopTracksShort.data)
    }

    catchErrors(fetchData())
    
  }, [])

  console.log(profile)

  const computedTrackTitle = `Top Tracks of ${useTracksLong === true ? 'All Time' : 'the Month'}`
  const computedArtistsTitle = `Top Artists of ${useArtistsLong === true ? 'All Time' : 'the Month'}`

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

      {topArtistsLong && topTracksLong && playlists && (
        <main>
          <SectionWrapper
            sectionId="section__top-artists"
            title={ computedArtistsTitle }
            seeAllLink="/top-artists">
            <div className="time__toggle">
              <button
                onClick={ () => setUseArtistsLong(true) }
                className={ useArtistsLong === true ? 'active' : '' }
                data-button="select">
                  All Time
                </button>
              <button
                onClick={ () => setUseArtistsLong(false) }
                className={ useArtistsLong === false ? 'active' : ''}
                data-button="select">
                  This Month
                </button>
            </div>
            <ArtistGrid artists={ useArtistsLong === true ? topArtistsLong.items : topArtistsShort.items }/>
          </SectionWrapper>
          
          <SectionWrapper
            sectionId="section__top-tracks"
            title={ computedTrackTitle }
            seeAllLink="/top-tracks">
              <div className="time__toggle">
                <button
                  onClick={ () => setUseTracksLong(true) }
                  className={ useTracksLong === true ? 'active' : '' }
                  data-button="select">
                    All Time
                  </button>
                <button
                  onClick={ () => setUseTracksLong(false) }
                  className={ useTracksLong === false ? 'active' : ''}
                  data-button="select">
                    This Month
                  </button>
              </div>
              <TrackList tracks={ useTracksLong === true ? topTracksLong.items : topTracksShort.items }/>
          </SectionWrapper>

          <SectionWrapper
            sectionId="section__playlists"
            title="Playlists"
            seeAllLink="/playlists">
            <PlaylistGrid playlists={ playlists.items.slice(0, 12) }/>
          </SectionWrapper>
        </main>
      )}
    </div>
  )
}

export default Profile