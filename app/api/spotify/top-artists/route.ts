import { NextResponse } from "next/server";
import { getTopArtists } from "@/lib/spotify";

export async function GET() {
  try {
    const data = await getTopArtists(8, 'medium_term');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: 500 });
  }
}

export const revalidate = 3600; // Cache for 1 hour
