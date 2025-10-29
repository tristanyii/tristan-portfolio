import { NextResponse } from "next/server";

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const redirect_uri = 'http://localhost:3000/api/auth-spotify/callback';

const scopes = [
  'user-read-email',
  'user-top-read',
  'user-read-currently-playing',
  'user-read-recently-played',
  'playlist-read-private',
].join(' ');

export async function GET() {
  const params = new URLSearchParams({
    client_id,
    response_type: 'code',
    redirect_uri,
    scope: scopes,
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

