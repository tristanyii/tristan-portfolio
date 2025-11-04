import { NextResponse } from "next/server";
import { getTopTracks, getTopArtists, getArtistTopTracks, getSavedTracks } from "@/lib/spotify";

// Force dynamic rendering - Spotify API requires runtime access
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REFRESH_TOKEN) {
      console.error('❌ Missing Spotify environment variables');
      return NextResponse.json([], { status: 200 }); // Return empty array
    }

    console.log("🎵 Fetching tracks from multiple sources...");
    
    // Try multiple sources to find tracks with preview URLs
    const [
      userTopTracks, 
      topArtists,
      savedTracks
    ] = await Promise.all([
      getTopTracks(50, 'short_term').catch(() => ({ items: [] })),
      getTopArtists(10, 'short_term').catch(() => ({ items: [] })),
      getSavedTracks(50).catch(() => ({ items: [] })),
    ]);

    const allTracks: any[] = [];

    // Add user's top tracks
    if (userTopTracks.items) {
      allTracks.push(...userTopTracks.items);
    }

    // Add user's saved/liked tracks
    if (savedTracks.items) {
      allTracks.push(...savedTracks.items.map((item: any) => item.track));
    }

    // Get top tracks from user's favorite artists
    if (topArtists.items && topArtists.items.length > 0) {
      console.log(`🎤 Fetching tracks from top ${topArtists.items.length} artists...`);
      const artistTracksPromises = topArtists.items.slice(0, 5).map((artist: any) => 
        getArtistTopTracks(artist.id).catch(() => ({ tracks: [] }))
      );
      const artistTracksResults = await Promise.all(artistTracksPromises);
      
      artistTracksResults.forEach(result => {
        if (result.tracks) {
          allTracks.push(...result.tracks);
        }
      });
    }

    // Remove duplicates
    const uniqueTracks = Array.from(
      new Map(allTracks.map(track => [track.id, track])).values()
    );

    // Prioritize tracks with preview URLs
    const tracksWithPreview = uniqueTracks.filter(track => track.preview_url);
    const tracksWithoutPreview = uniqueTracks.filter(track => !track.preview_url);
    
    console.log(`✅ Found ${tracksWithPreview.length} playable tracks out of ${uniqueTracks.length} total`);
    if (tracksWithPreview.length > 0) {
      console.log(`🎵 Sample tracks: ${tracksWithPreview.slice(0, 3).map(t => t.name).join(', ')}`);
    }

    // Return tracks directly as an array (not wrapped in items)
    return NextResponse.json([...tracksWithPreview, ...tracksWithoutPreview].slice(0, 50));
  } catch (error: any) {
    console.error('❌ Error fetching tracks:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array on error
  }
}

export const revalidate = 21600; // Cache for 6 hours (music taste doesn't change that often)
