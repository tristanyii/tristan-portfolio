// Simple script to get your Spotify refresh token
// Run this once: node get-spotify-token.js

const readline = require('readline');
const http = require('http');
const { spawn } = require('child_process');

const CLIENT_ID = '7eb0f40d7b0a44768482b1787c28a930';
const CLIENT_SECRET = '4aefae3b129640908d05a9de6aa7ce37';
const REDIRECT_URI = 'http://localhost:8888/callback';
const PORT = 8888;

const scopes = [
  'user-read-email',
  'user-top-read',
  'user-read-currently-playing',
  'user-read-recently-played',
  'playlist-read-private',
].join(' ');

console.log('\n🎵 Spotify Token Generator\n');
console.log('Step 1: Add this redirect URI to your Spotify app:');
console.log('→ http://localhost:8888/callback\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Press Enter after adding the redirect URI to Spotify Dashboard...', () => {
  rl.close();
  
  const server = http.createServer(async (req, res) => {
    if (req.url.startsWith('/callback')) {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      const code = url.searchParams.get('code');
      
      if (!code) {
        res.writeHead(400);
        res.end('No code received');
        return;
      }

      try {
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
          }),
        });

        const data = await tokenResponse.json();
        
        if (data.refresh_token) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <head><title>Success!</title></head>
              <body style="font-family: system-ui; padding: 40px; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #1DB954;">✅ Success!</h1>
                <h2>Your Refresh Token:</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; word-break: break-all; font-family: monospace;">
                  ${data.refresh_token}
                </div>
                <h3 style="margin-top: 30px;">Next Steps:</h3>
                <ol>
                  <li>Copy the token above</li>
                  <li>Add to your .env.local file: <code>SPOTIFY_REFRESH_TOKEN=your_token</code></li>
                  <li>Restart your dev server</li>
                  <li>Delete this script (get-spotify-token.js)</li>
                </ol>
                <p>You can close this window now.</p>
              </body>
            </html>
          `);
          
          console.log('\n✅ Success! Your refresh token:');
          console.log(data.refresh_token);
          console.log('\n📝 Add this to your .env.local:');
          console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
          
          setTimeout(() => {
            server.close();
            process.exit(0);
          }, 1000);
        } else {
          throw new Error('No refresh token received');
        }
      } catch (error) {
        res.writeHead(500);
        res.end('Error: ' + error.message);
        server.close();
      }
    }
  });

  server.listen(PORT, () => {
    const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: scopes,
    })}`;
    
    console.log('\n🌐 Opening browser...');
    console.log('If it doesn\'t open automatically, go to:');
    console.log(authUrl + '\n');
    
    // Try to open browser
    const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    spawn(cmd, [authUrl], { stdio: 'ignore', detached: true }).unref();
  });
});

