# Vercel Deployment Setup Guide

## 🎵 Fix Spotify Music Display on Vercel

Your Spotify integration works locally but not on Vercel because **environment variables are missing** on Vercel.

### ✅ Step 1: Add Environment Variables to Vercel

Go to your Vercel project settings:
1. Open https://vercel.com/dashboard
2. Select your project (`personalwebsite`)
3. Go to **Settings** → **Environment Variables**
4. Add these **3 variables**:

| Variable Name | Value | Source |
|--------------|--------|---------|
| `SPOTIFY_CLIENT_ID` | `7eb0f40d7b0a44768482b1787c28a930` | From SPOTIFY_SETUP.md |
| `SPOTIFY_CLIENT_SECRET` | `4aefae3b129640908d05a9de6aa7ce37` | From SPOTIFY_SETUP.md |
| `SPOTIFY_REFRESH_TOKEN` | *Your refresh token* | See below |

### 🔑 Step 2: Get Your Refresh Token (If You Don't Have It)

#### Option A: If you have it locally

Check your local `.env.local` file for `SPOTIFY_REFRESH_TOKEN`

#### Option B: Generate a new one

1. **Get Authorization Code** - Open this URL in your browser:
```
https://accounts.spotify.com/authorize?client_id=7eb0f40d7b0a44768482b1787c28a930&response_type=code&redirect_uri=https://tristanyi.vercel.app/api/auth/callback/spotify&scope=user-read-email%20user-top-read%20user-read-currently-playing%20user-read-recently-played%20playlist-read-private
```

2. **After authorization**, you'll be redirected to:
```
https://tristanyi.vercel.app/api/auth/callback/spotify?code=AQD...
```
**Copy the entire `code` parameter** (the long string after `?code=`)

3. **Exchange code for refresh token** - Run this in your terminal (replace `YOUR_CODE`):
```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_CODE" \
  -d "redirect_uri=https://tristanyi.vercel.app/api/auth/callback/spotify" \
  -d "client_id=7eb0f40d7b0a44768482b1787c28a930" \
  -d "client_secret=4aefae3b129640908d05a9de6aa7ce37"
```

4. **Copy the `refresh_token`** from the JSON response

5. **Add it to Vercel** as `SPOTIFY_REFRESH_TOKEN`

### 🚀 Step 3: Redeploy

After adding the environment variables:
1. Go to **Deployments** tab
2. Click the **⋮** menu on your latest deployment
3. Click **Redeploy**
4. ✅ Your music should now display!

---

## 🔍 Troubleshooting

### Check Vercel Logs

1. Go to your deployment on Vercel
2. Click **View Function Logs**
3. Look for these messages:
   - ❌ `Missing Spotify environment variables` - Variables not set
   - ✅ `Got access token` - Working correctly

### Test Your API

Visit these URLs after deployment:
- `https://tristanyi.vercel.app/api/spotify/top-artists`
- `https://tristanyi.vercel.app/api/spotify/top-tracks`

You should see JSON data with your top artists/tracks.

---

## 📝 Notes

- Environment variables are **NOT** synced automatically between local and Vercel
- Refresh tokens **don't expire** (usually), so set it once and forget it
- The music section will show "View My Spotify Profile" button when API is not configured
- On localhost, variables are loaded from `.env.local` file
- On Vercel, variables must be set in the dashboard

---

## 🎉 Success!

Once configured, your Spotify integration will:
- Show your top 8 artists
- Display genres for each artist
- Update automatically every hour
- Work for all visitors (no login required)

