import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');
    
    console.log('🔍 YouTube API: Received query:', query);
    
    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.error('❌ YouTube API key not configured');
      return NextResponse.json({ error: 'YouTube API not configured' }, { status: 500 });
    }

    console.log('✅ YouTube API key found, making request...');

    // Search YouTube for the video
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${apiKey}`;
    console.log('📡 Requesting:', url.replace(apiKey, 'HIDDEN'));
    
    const response = await fetch(url);
    
    console.log('📡 YouTube API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ YouTube API error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      return NextResponse.json({ 
        error: 'YouTube API request failed',
        details: errorData
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ YouTube API response:', JSON.stringify(data).substring(0, 200));

    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      console.log('✅ Found video:', video.id.videoId);
      return NextResponse.json({
        videoId: video.id.videoId,
        title: video.snippet.title,
      });
    }

    console.log('⚠️ No videos found in response');
    return NextResponse.json({ error: 'No video found' }, { status: 404 });
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
export const revalidate = 3600; // Cache for 1 hour

