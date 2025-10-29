import { NextRequest, NextResponse } from 'next/server';
import { getAllLocations, saveLocation, deleteLocation } from '@/lib/db';

// GET - Fetch all locations
export async function GET() {
  try {
    const locations = await getAllLocations();
    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

// POST - Create or update a location
export async function POST(request: NextRequest) {
  try {
    const location = await request.json();
    
    // Validate required fields
    if (!location.id || !location.name || !location.country || !location.coordinates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const savedLocation = await saveLocation(location);
    return NextResponse.json({ location: savedLocation });
  } catch (error) {
    console.error('Error saving location:', error);
    return NextResponse.json({ error: 'Failed to save location' }, { status: 500 });
  }
}

// DELETE - Remove a location
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Location ID required' }, { status: 400 });
    }
    
    const deleted = await deleteLocation(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}

