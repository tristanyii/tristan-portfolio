import { NextRequest, NextResponse } from "next/server";
import { getTopArtists } from "@/lib/spotify";

// Force dynamic rendering - Spotify API requires runtime access
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Check if environment variables are set
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REFRESH_TOKEN) {
      console.error('❌ Missing Spotify environment variables');
      return NextResponse.json({ 
        error: 'Spotify API not configured',
        items: [] // Return empty items so the component shows fallback
      }, { status: 200 });
    }

    // Use nextUrl instead of req.url to avoid static generation issues
    const timeRange = req.nextUrl.searchParams.get('time_range') || 'medium_term';
    const data = await getTopArtists(8, timeRange as 'short_term' | 'medium_term' | 'long_term');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error fetching top artists:', error);
    return NextResponse.json({ 
      error: error?.message || 'Failed to fetch top artists',
      items: [] // Return empty items so the component shows fallback
    }, { status: 200 });
  }
}

export const revalidate = 21600; // Cache for 6 hours (music taste doesn't change that often)
