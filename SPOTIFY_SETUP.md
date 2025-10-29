# Get Your Spotify Refresh Token (Without Adding More URLs)

## Method 1: Use Spotify's Web API Console (Easiest)

1. Go to: https://developer.spotify.com/console/get-users-top-artists-and-tracks/
2. Click **"GET TOKEN"**
3. Check all the scopes you need:
   - `user-read-email`
   - `user-top-read`
   - `user-read-currently-playing`
   - `user-read-recently-played`
   - `playlist-read-private`
4. Click **"Request Token"**
5. You'll get an **Access Token** (not refresh token yet)
6. Open a terminal and run this command (replace YOUR_ACCESS_TOKEN):

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token&refresh_token=YOUR_REFRESH_TOKEN"
```

Actually, the web console doesn't give refresh tokens...

## Method 2: Manual Authorization (Works!)

### Step 1: Get Authorization Code

Open this URL in your browser (all one line):

```
https://accounts.spotify.com/authorize?client_id=7eb0f40d7b0a44768482b1787c28a930&response_type=code&redirect_uri=https://tristanyi.vercel.app/api/auth/callback/spotify&scope=user-read-email%20user-top-read%20user-read-currently-playing%20user-read-recently-played%20playlist-read-private
```

### Step 2: You'll be redirected to your Vercel URL (which doesn't exist yet, that's okay!)

The URL will look like:
```
https://tristanyi.vercel.app/api/auth/callback/spotify?code=AQD...
```

**Copy the entire code after `?code=`** (it's long!)

### Step 3: Exchange code for refresh token

Open terminal and run (replace YOUR_CODE with the code you copied):

```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_CODE" \
  -d "redirect_uri=https://tristanyi.vercel.app/api/auth/callback/spotify" \
  -d "client_id=7eb0f40d7b0a44768482b1787c28a930" \
  -d "client_secret=4aefae3b129640908d05a9de6aa7ce37"
```

### Step 4: You'll get JSON back with your refresh_token!

Copy the `refresh_token` value and add it to your `.env.local`:

```
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

### Step 5: Restart your dev server

```bash
npm run dev -- --turbopack
```

Done! Your Spotify data will now load automatically for all visitors!

