import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

// Force dynamic rendering - Spotify API requires runtime access
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getNowPlaying();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ isPlaying: false }, { status: 200 });
  }
}

export const revalidate = 60; // Cache for 1 minute
