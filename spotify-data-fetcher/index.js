const fs      = require('fs');
const fetcher = require('./fetcher');

const GENRES_TO_USE = [
  'pop',
  'rap',
  'rock'
];

const PLAYLIST_IDS = [
  // Easy to classify
  '37i9dQZF1DXcBWIGoYBM5M', // Todays top hits
  '37i9dQZF1DXcF6B6QPhFDv', // Rock this (Rock songs)
  '37i9dQZF1DX0XUsuxWHRQd', // Rap Caviar
  '37i9dQZF1DWZjmJmeiazwd', // Rock gaming
  '37i9dQZF1DX82Zzp6AKx64', // Power Balads
  '37i9dQZF1DX1spT6G94GFC', // 80s rock anthems
  '37i9dQZF1DWY4xHQp97fN6', // Get turnt "Rap"
  '37i9dQZF1DX186v583rmzp', // I love my 90s Hip Hop

  // // More abstract
  // '37i9dQZF1DWSTeI2WWFaia', // Spilled Ink (Lyrical Lofi and Lowlife raps)
  // '37i9dQZF1DWWqNV5cS50j6', // Anti Pop
  // '54HYKeuOBm0CYSJPKHwYEt', // TikTok Songs
];

const sleep = ms => new Promise( resolve => setTimeout( resolve, ms ) );
const tracksToUse = [];
const seenSongs = {};
const genreCount = {};

const fetch = async() => {
  // Wait for token from Spotify
  await sleep( 1000 );

  for ( const playlistID of PLAYLIST_IDS ) {
    console.log( playlistID );

    let tracksSeen = 0;
    let total      = Infinity;
    let items      = [];
    const tracks   = [];

    while ( tracksSeen < total ) {
      ( { items, total } = await fetcher.getTracksOfPlaylist(
        playlistID,
        { limit: 100, offset: tracksSeen }
      ) );

      tracksSeen += items.length;

      tracks.push(
        ...items.reduce( ( reduced, { track } ) => {
          if ( track && !seenSongs[ track.id ] ) {
            seenSongs[ track.id ] = true;
            reduced.push({
              trackID: track.id,
              name: track.name,
              artistID: track.artists[ 0 ].id,
              artistName: track.artists[ 0 ].name
            });
          }

          return reduced;
        }, [] )
      );
    }

    console.log( `  To Fetch: ${ tracks.length }` );

    let i = 0;
    process.stdout.write(`  `);
    for ( const track of tracks ) {
      if ( i < tracks.length - 1 ) {
        process.stdout.write( `${ i + 1 }, ` );
      } else {
        process.stdout.write( `${ i + 1 }\n\n` );
      }

      if ( i % 10 === 0 ) {
        await sleep( 1500 );
      }

      i++;
      const infoOnArtistPromise    = fetcher.getInfoOnArtsist( track.artistID );
      const featuresOfTrackPromise = fetcher.getAudioFeaturesForTrack( track.trackID );

      try {
        const [
          infoOnArtist,
          { type, id, uri, track_href, analysis_url, ...audioFeaturesOfTrack }
        ] = await Promise.all([ infoOnArtistPromise, featuresOfTrackPromise ])
        .catch( e => { throw e; } );

        track.audioFeatures = audioFeaturesOfTrack;
        track.genres = infoOnArtist.genres.reduce( ( reduced, curr ) => {
          for ( const genre of GENRES_TO_USE ) {
            if ( curr.indexOf( genre ) !== -1 ) {
              //console.log(curr);
              if (!reduced.includes(genre)) {
                //console.log(adding)
                reduced.push(genre)
              }
            }
          }

          return reduced;
        }, [] );

        if ( track.genres.length > 0 ) {
          tracksToUse.push( track );

          for (const genre of track.genres) {
            if ( genreCount[ genre ] ) {
              genreCount[ genre ] += 1;
            } else {
              genreCount[ genre ] = 1;
            }
          }
          }          
      } catch ( e ) {}
    }
  }

  console.log( `Total tracks: ${ tracksToUse.length }` );
  console.log( genreCount );

  fs.writeFileSync( './audio-features.json', JSON.stringify( tracksToUse, null, 2 ) );

  process.exit( 1 );
};

fetch();

