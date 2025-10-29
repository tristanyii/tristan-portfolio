import { NextResponse } from "next/server";
import { getTopArtists } from "@/lib/spotify";

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REFRESH_TOKEN) {
      console.error('❌ Missing Spotify environment variables');
      return NextResponse.json({ 
        error: 'Spotify API not configured',
        items: [] // Return empty items so the component shows fallback
      }, { status: 200 });
    }

    const data = await getTopArtists(8, 'medium_term'); // Last 6 months instead of 4 weeks
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
