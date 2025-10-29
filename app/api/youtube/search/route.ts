import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.error('YouTube API key not configured');
      return NextResponse.json({ error: 'YouTube API not configured' }, { status: 500 });
    }

    // Search YouTube for the video
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      return NextResponse.json({
        videoId: video.id.videoId,
        title: video.snippet.title,
      });
    }

    return NextResponse.json({ error: 'No video found' }, { status: 404 });
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return NextResponse.json({ error: 'Failed to search YouTube' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

