# Vercel Environment Variables Setup

Your website needs the following environment variables to work on Vercel:

## Required Environment Variables

### 1. Spotify API (for music section)
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

### 2. YouTube API (for music player)
```
YOUTUBE_API_KEY=your_youtube_api_key
```

## How to Add Them to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (`tristan-portfolio`)
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Add each variable:
   - **Key**: Variable name (e.g., `SPOTIFY_CLIENT_ID`)
   - **Value**: The actual value from your `.env.local` file
   - **Environment**: Select all three (Production, Preview, Development)
6. Click **Save**

## Quick Check - Copy Your Current Values

Run this in your terminal to see your current values:

```bash
cat .env.local
```

Then copy each value to Vercel.

## After Adding Variables

1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Or just push a new commit to trigger auto-deployment

## Verify Setup

After deployment, check:
- Music section loads your top artists ✅
- YouTube music player (bottom right) works ✅
- No console errors in browser ✅

