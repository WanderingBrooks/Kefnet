const fs      = require('fs');
const fetcher = require('./fetcher');

const GENRES_TO_USE = [
  'pop',
  'rap',
  'rock'
];

const OTHER_GENRES = [
  'hip hop',
  'rnb',
  'indie'
];

const PLAYLIST_IDS = [
  // Easy to classify
  '37i9dQZF1DXcBWIGoYBM5M', // Todays top hits
  '37i9dQZF1DXcF6B6QPhFDv', // Rock this (Rock songs)
  '37i9dQZF1DX0XUsuxWHRQd', // Rap Caviar

  // More abstract
  '37i9dQZF1DWSTeI2WWFaia', // Spilled Ink (Lyrical Lofi and Lowlife raps)
  '37i9dQZF1DWWqNV5cS50j6', // Anti Pop
  '54HYKeuOBm0CYSJPKHwYEt' // TikTok Songs
];

const sleep = ms => new Promise( resolve => setTimeout( resolve, ms ) );
const tracksToUse = [];

const fetch = async() => {
  await sleep( 1000 );

  for ( const playlistID of PLAYLIST_IDS ) {
    console.log( playlistID );
    const { items } = await fetcher.getTracksOfPlaylist( playlistID );
    const tracks = items.map( ({ track }) => ({
      trackID: track.id,
      name: track.name,
      artistID: track.artists[ 0 ].id,
      artistName: track.artists[ 0 ].name
    }) );

    let i = 0;
    for ( const track of  tracks ) {
      if ( i % 10 === 0 ) {
        console.log('waiting');
        await sleep( 1000 );
      }

      i++;
      const infoOnArtistPromise = fetcher.getInfoOnArtsist( track.artistID );
      const featuresOfTrackPromise = fetcher.getAudioFeaturesForTrack( track.trackID );

      try {
        const [
          infoOnArtist,
          audioFeaturesOfTrack
        ] = await Promise.all([ infoOnArtistPromise, featuresOfTrackPromise ])
        .catch( e => { throw e; } );

        track.audioFeatures = audioFeaturesOfTrack;
        track.genre = infoOnArtist.genres.reduce( ( reduced, curr ) => {
          if ( GENRES_TO_USE.includes( reduced ) ) {
            return reduced;
          }

          for ( const genre of GENRES_TO_USE ) {
            if ( genre === curr ) {
              return curr;
            } else if ( curr.indexOf( genre ) !== -1 ) {
              return genre;
            }
          }
        }, '' );

        if ( track.genre !== '' ) {
          tracksToUse.push( track );
        }
      } catch ( e ) {
        console.error( e );
      }
    }
  }

  console.log( tracksToUse.length );

  fs.writeFileSync( './audio-features.json', JSON.stringify( tracksToUse ) );

  process.exit( 1 );
};

fetch();

