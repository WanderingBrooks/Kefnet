const fs      = require('fs');
const fetcher = require('./fetcher');

const GENRES_TO_USE = [
  'pop',
  'rap',
  'rock'
];

const SONGS_TO_SKIP = [
  '2kJwzbxV2ppxnQoYw4GLBZ',
  '4cI2rd2D44mBjwUVFxTkUZ',
  '5bl2pNsPhMT37RkDUa57Ab',
  '78Whqvk23AqxailSEMv83F',
  '2MqaQfeuanwWhfrJAK8P7K',
  '5Kjz86OFAoN6D4kF1BTSEc',
  '1AzqpMy3yLYNITSOUrnL8i',
  '015GITSMhfWPGvDZTcmwbo',
  '4gF5IWlKhmVBWzjXFZ5VlW',
  '2rB3bbEiGVPkL2mxlzsLSc',
  '6r5vCcdUfYVqkxJzp9Nr1z',
  '5DYD4zlGiFlkpLaf2Bk8Vl',
  '39O0nR2jufNAGnZCARLd5S',
  '6sGTEdVdQ1elMrhg9dS2Eg',
  '1piXWeTvZCGO8GAvJHYUPc',
  '4B0r8wQP0qfyDFaPs4Rjnz',
  '7oOOI85fVQvVnK5ynNMdW7',
  '0hSzixwdKTfDQewDKq2cP5',
  '3JTjLyrnevl9ASw3ayGO2P',
  '1595LW73XBxkRk2ciQOHfr',
  '58IHCvoCPfMNS0WrK7JnSg',
  '07rmSXN6vNoquX1AsWd9pP',
  '1YR9iNGXtsbrd8deR9ULDD',
  '6URlKrAIlJJwHnHxxXWywt',
  '0TK2YIli7K1leLovkQiNik',
  '2adTfABiJJQpZWlujYO3Qo',
  '0ICY4TtDdjDd0kSR3vv148',
  '1jXAprN4NTcfleztufIHom',
  '0P6AWOA4LG1XOctzaVu5tt',
  '6JqYhSdTE4WbQrMXxPH5cD',
  '7CTWqCb7LpbwCYawPGg9MZ',
  '4sjiIpEv617LDXaidKioOI',
  '0D1pEisM3QkiacGXJe5dmd',
  '6qVPeiDQyjLbZKN24ufCu7',
  '5sGb7vB83MhpdZsx1tEIYH',
  '6vN77lE9LK6HP2DewaN6HZ',
  '57disvXYFrIA66G27Aa5yG',
  '6kylq8X8cxbGs4YoeLxgk6',
  '3UnYMo1aeD0o8VtHy3R8cs',
  '4DdKpYcyTqDpVOiJuT894E',
  '1R8kvV2AgNPCA2Pp4Im1Ao',
  '1nQZC5d0lR56oKRbNLyP8v',
  '6Qb16QNat979ujJka6hhfQ',
  '1bBYR801JoHJ6fOlXdmgJa',
  '5pfJsMwoRYKampPay8amX0',
  '455AfCsOhhLPRc68sE01D8',
  '0vRa1EzwXx7b56uXsuctFU',
  '2Wq9wjMTn2qD1zlfRYJtv8',
  '6GfTYfb5eBLN1p1ByOsPmi',
  '4Yxc55NX3tAXC2mHRAhtcW',
  '4rCKRVJZKVysScn2piDuOT',
  '0g21KZ1XJuhwexWPLpuEt1',
  '7BYppcUTuG5ysmaJlGSt3t',
  '4SDgTLDYrJ2UrHbkRkg7MD',
  '5MPPttjfGap2C6j6eKcO6J',
  '4a6q8CR2hzLk2plDkSxkfD',
  '6cXfnv6CBEr5zWQaQGQLVB',
  '7k6IzwMGpxnRghE7YosnXT',
  '7kl7cL0bOFxnOMruVLh8ve',
  '11LmqTE2naFULdEP94AUBa',
  '47StfXJOnGLhYfMEWgoTiX',
  '3hTpoe9foSCDu6NS0vlHQS',
  '0UrWr7Jnu1heq1o99ZwUd0',
  '1FTSo4v6BOZH9QxKc3MbVM',
  '0fIC59ZyS8ThtUF0Um6zuD',
  '0Xq7FPQaLJgIHSB605YUMy',
  '51c94ac31swyDQj9B3Lzs3',
  '2Df8M8sO1zhC71p2XQRwpj',
  '4PgJ0NUYaDDh659TW5mWBK',
  '2GiJYvgVaD2HtM8GqD9EgQ',
  '1hWQvA6oGVJ2mAVsZ59AaV'
];

const PLAYLIST_IDS = [
  // Easy to classify
  // '37i9dQZF1DXcBWIGoYBM5M', // Todays top hits
  // '37i9dQZF1DXcF6B6QPhFDv', // Rock this (Rock songs)
  // '37i9dQZF1DX0XUsuxWHRQd', // Rap Caviar
  // '37i9dQZF1DWZjmJmeiazwd' // Rock gaming
  '37i9dQZF1DX82Zzp6AKx64', // Power Balads
  '37i9dQZF1DX1spT6G94GFC', // 80s rock anthems
  '37i9dQZF1DWY4xHQp97fN6', // Get turnt "Rap"
  '37i9dQZF1DX186v583rmzp' // I love my 90s Hip Hop

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
          if ( track && !seenSongs[ track.id ] && !SONGS_TO_SKIP.includes(track.id)  ) {
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

          return reduced;
        }, '' );

        if ( track.genre !== '' ) {
          tracksToUse.push( track );

          if ( genreCount[ track.genre ] ) {
            genreCount[ track.genre ] += 1;
          } else {
            genreCount[ track.genre ] = 1;
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

