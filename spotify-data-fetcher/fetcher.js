const SpotifyWebApi = require('spotify-web-api-node');

class SpotifyAPI {
  constructor( cfg ) {
    this.api = new SpotifyWebApi( cfg );
  }

  async refreshAccessToken() {
    const { body } = await this.api.clientCredentialsGrant();

    this.api.setAccessToken( body['access_token'] );

    setTimeout(
      this.refreshAccessToken.bind( this ),
      ( body['expires_in'] - 10 ) * 1000
    );
  }

  async getAudioFeaturesForTrack( trackID ) {
    const { body } = await this.api.getAudioFeaturesForTrack( trackID );

    return body;
  }

  async getInfoOnArtsist( artistID ) {
    const { body } = await this.api.getArtist( artistID );

    return body;
  }

  async getTracksOfPlaylist( playlistID, options ) {
    const { body } = await this.api.getPlaylistTracks( playlistID, options );

    return body;
  }
}

const sharedAPI = new SpotifyAPI({
  clientId:     process.env.clientId,
  clientSecret: process.env.clientSecret
});

sharedAPI.refreshAccessToken();

module.exports = sharedAPI;
