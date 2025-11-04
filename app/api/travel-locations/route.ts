import { NextRequest, NextResponse } from 'next/server';
import { getAllLocations, saveLocation, deleteLocation } from '@/lib/db';

// Force dynamic rendering - database operations require runtime access
export const dynamic = 'force-dynamic';

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
    if (!location.id || !location.name || !location.country) {
      console.error('Missing basic fields:', { id: location.id, name: location.name, country: location.country });
      return NextResponse.json({ error: 'Missing required fields: id, name, or country' }, { status: 400 });
    }
    
    // Validate coordinates
    if (!location.coordinates || typeof location.coordinates.lat !== 'number' || typeof location.coordinates.lng !== 'number') {
      console.error('Invalid coordinates:', location.coordinates);
      return NextResponse.json({ error: 'Invalid or missing coordinates. Please set a location on the map or use the geocode button.' }, { status: 400 });
    }
    
    // Check for duplicates by name (but allow updates with same ID)
    const allLocations = await getAllLocations();
    const duplicate = allLocations.find(loc => loc.name === location.name && loc.id !== location.id);
    if (duplicate) {
      console.warn(`Duplicate location detected: ${location.name} (existing ID: ${duplicate.id})`);
      return NextResponse.json({ 
        error: `Location "${location.name}" already exists! Please edit the existing one or choose a different name.` 
      }, { status: 409 });
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
    // Use nextUrl instead of request.url to avoid static generation issues
    const id = request.nextUrl.searchParams.get('id');
    
    console.log('🗑️  DELETE request for location ID:', id);
    
    if (!id) {
      console.error('No ID provided in delete request');
      return NextResponse.json({ error: 'Location ID required' }, { status: 400 });
    }
    
    const deleted = await deleteLocation(id);
    
    if (!deleted) {
      console.error(`Failed to delete location ${id} - not found`);
      return NextResponse.json({ error: 'Location not found or already deleted' }, { status: 404 });
    }
    
    console.log(`✅ Successfully deleted location ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE endpoint:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete location' 
    }, { status: 500 });
  }
}

