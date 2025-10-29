import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const state = searchParams.get('state');

    if (!city) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    // Build query string
    let query = city;
    if (state) query += `, ${state}`;
    if (country) query += `, ${country}`;

    // Use Nominatim (OpenStreetMap) geocoding service
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PersonalWebsite/1.0', // Required by Nominatim
      },
    });

    if (!response.ok) {
      throw new Error('Geocoding service error');
    }

    const data = await response.json();

    if (data.length === 0) {
      return NextResponse.json({ 
        error: 'Location not found',
        message: 'Could not find coordinates for this location. Try being more specific or enter coordinates manually.'
      }, { status: 404 });
    }

    const result = data[0];
    
    return NextResponse.json({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json({ 
      error: 'Failed to geocode location',
      message: 'An error occurred while finding the location coordinates.'
    }, { status: 500 });
  }
}

