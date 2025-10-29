import { NextRequest, NextResponse } from "next/server";

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirect_uri = 'http://localhost:3000/api/auth-spotify/callback';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return new NextResponse('No code provided', { status: 400 });
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
    }),
  });

  const data = await response.json();

  if (data.refresh_token) {
    return new NextResponse(
      `
<!DOCTYPE html>
<html>
<head>
  <title>Spotify Auth Success</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #1a1a1a;
      color: #fff;
    }
    .container {
      background: #282828;
      padding: 30px;
      border-radius: 10px;
    }
    h1 { color: #1DB954; }
    .token {
      background: #1a1a1a;
      padding: 15px;
      border-radius: 5px;
      word-break: break-all;
      font-family: monospace;
      margin: 20px 0;
    }
    .instructions {
      background: #1DB954;
      color: #000;
      padding: 20px;
      border-radius: 5px;
      margin: 20px 0;
    }
    code {
      background: #1a1a1a;
      color: #1DB954;
      padding: 2px 6px;
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>✅ Spotify Authentication Successful!</h1>
    <p>Your refresh token has been generated. Follow these steps:</p>
    
    <div class="instructions">
      <h3>📝 Next Steps:</h3>
      <ol>
        <li>Copy the refresh token below</li>
        <li>Open your <code>.env.local</code> file</li>
        <li>Add this line:<br><code>SPOTIFY_REFRESH_TOKEN=your_token_here</code></li>
        <li>Restart your dev server</li>
      </ol>
    </div>

    <h3>Your Refresh Token:</h3>
    <div class="token">${data.refresh_token}</div>

    <p><strong>⚠️ Keep this token private!</strong> Don't share it or commit it to git.</p>
    
    <p>After adding the token to .env.local, your website will automatically show your Spotify data to all visitors!</p>
  </div>
</body>
</html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }

  return new NextResponse('Failed to get refresh token', { status: 500 });
}

