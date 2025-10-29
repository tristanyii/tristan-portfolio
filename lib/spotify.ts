const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const TOP_ARTISTS_ENDPOINT = 'https://api.spotify.com/v1/me/top/artists';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const ARTIST_TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/artists';
const SAVED_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/tracks';

async function getAccessToken() {
  console.log('🔑 Getting Spotify access token...');
  
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  const data = await response.json();
  
  if (!response.ok || !data.access_token) {
    console.error('❌ Failed to get access token:', data);
    throw new Error(`Spotify authentication failed: ${data.error || 'Unknown error'}`);
  }
  
  console.log('✅ Got access token');
  return data;
}

export async function getTopArtists(limit = 8, timeRange = 'medium_term') {
  const { access_token } = await getAccessToken();

  const response = await fetch(`${TOP_ARTISTS_ENDPOINT}?limit=${limit}&time_range=${timeRange}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch top artists');
  }

  return response.json();
}

export async function getTopTracks(limit = 10, timeRange = 'short_term') {
  const { access_token } = await getAccessToken();

  const response = await fetch(`${TOP_TRACKS_ENDPOINT}?limit=${limit}&time_range=${timeRange}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch top tracks');
  }

  return response.json();
}

export async function getNowPlaying() {
  const { access_token } = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (response.status === 204 || response.status > 400) {
    return { isPlaying: false };
  }

  return response.json();
}

export async function getArtistTopTracks(artistId: string, market = 'US') {
  const { access_token } = await getAccessToken();

  const response = await fetch(`${ARTIST_TOP_TRACKS_ENDPOINT}/${artistId}/top-tracks?market=${market}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch artist top tracks');
  }

  return response.json();
}

export async function getSavedTracks(limit = 50) {
  const { access_token } = await getAccessToken();

  const response = await fetch(`${SAVED_TRACKS_ENDPOINT}?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch saved tracks');
  }

  return response.json();
}

