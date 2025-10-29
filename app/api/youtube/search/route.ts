import { NextRequest, NextResponse } from "next/server";

// Track which keys have exceeded quota (resets when server restarts)
const exhaustedKeys = new Set<string>();

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');
    
    console.log('🔍 YouTube API: Received query:', query);
    
    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    // Get all available API keys
    const apiKeys = [
      process.env.YOUTUBE_API_KEY,
      process.env.YOUTUBE_API_KEY_2,
    ].filter(Boolean) as string[];
    
    if (apiKeys.length === 0) {
      console.error('❌ No YouTube API keys configured');
      return NextResponse.json({ error: 'YouTube API not configured' }, { status: 500 });
    }

    console.log(`✅ Found ${apiKeys.length} YouTube API key(s), ${exhaustedKeys.size} exhausted`);

    // Try each key that hasn't been exhausted
    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      const keyName = `Key ${i + 1}`;
      
      if (exhaustedKeys.has(apiKey)) {
        console.log(`⏭️ Skipping ${keyName} (quota exhausted)`);
        continue;
      }

      console.log(`🔑 Trying ${keyName}...`);

      // Search YouTube for the video
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${apiKey}`;
      
      const response = await fetch(url);
      
      console.log(`📡 ${keyName} response status:`, response.status);

      if (response.ok) {
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const video = data.items[0];
          console.log(`✅ ${keyName} success! Found video:`, video.id.videoId);
          return NextResponse.json({
            videoId: video.id.videoId,
            title: video.snippet.title,
          });
        }

        console.log(`⚠️ ${keyName} returned no videos`);
        return NextResponse.json({ error: 'No video found' }, { status: 404 });
      }

      // Handle errors
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      // Check if quota exceeded
      if (response.status === 403 && errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
        console.warn(`🚫 ${keyName} quota exhausted, marking as unavailable`);
        exhaustedKeys.add(apiKey);
        // Continue to next key
        continue;
      }

      // Other error, return it
      console.error(`❌ ${keyName} error:`, errorText);
      return NextResponse.json({ 
        error: 'YouTube API request failed',
        details: errorData
      }, { status: response.status });
    }

    // All keys exhausted
    console.error('❌ All YouTube API keys have exceeded quota');
    return NextResponse.json({ 
      error: 'All API keys have exceeded quota',
      message: 'Please try again tomorrow when quota resets'
    }, { status: 429 });
    
  } catch (error: any) {
    console.error('❌ Exception in YouTube API route:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to search YouTube',
      message: error.message 
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 7200; // Cache for 2 hours (reduce API calls)

