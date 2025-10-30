import { neon } from '@neondatabase/serverless';

export interface TravelLocation {
  id: string;
  name: string;
  city?: string;
  country: string;
  state?: string;
  visited: boolean;
  date?: string;
  description?: string;
  photos?: string[];
  coordinates: { lat: number; lng: number };
}

// Get database connection
function getDb() {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL environment variable is not set');
  }
  return neon(process.env.POSTGRES_URL);
}

// Read all locations
export async function getAllLocations(): Promise<TravelLocation[]> {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, city, country, state, visited, date, description, photos, lat, lng
      FROM travel_locations
      ORDER BY created_at DESC
    `;
    
    return rows.map((row: any) => {
      const lat = typeof row.lat === 'string' ? parseFloat(row.lat) : row.lat;
      const lng = typeof row.lng === 'string' ? parseFloat(row.lng) : row.lng;
      
      return {
        id: row.id,
        name: row.name,
        city: row.city,
        country: row.country,
        state: row.state,
        visited: row.visited,
        date: row.date,
        description: row.description,
        photos: row.photos || [],
        coordinates: {
          lat: Number(lat),
          lng: Number(lng),
        },
      };
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

// Add or update a location
export async function saveLocation(location: TravelLocation): Promise<TravelLocation> {
  const sql = getDb();
  
  await sql`
    INSERT INTO travel_locations (
      id, name, city, country, state, visited, date, description, photos, lat, lng
    ) VALUES (
      ${location.id},
      ${location.name},
      ${location.city || null},
      ${location.country},
      ${location.state || null},
      ${location.visited !== false},
      ${location.date || null},
      ${location.description || null},
      ${location.photos || []},
      ${location.coordinates.lat},
      ${location.coordinates.lng}
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      city = EXCLUDED.city,
      country = EXCLUDED.country,
      state = EXCLUDED.state,
      visited = EXCLUDED.visited,
      date = EXCLUDED.date,
      description = EXCLUDED.description,
      photos = EXCLUDED.photos,
      lat = EXCLUDED.lat,
      lng = EXCLUDED.lng,
      updated_at = CURRENT_TIMESTAMP
  `;
  
  return location;
}

// Delete a location
export async function deleteLocation(id: string): Promise<boolean> {
  try {
    const sql = getDb();
    
    // First check if the location exists
    const existing = await sql`
      SELECT id FROM travel_locations WHERE id = ${id}
    `;
    
    if (existing.length === 0) {
      console.error(`Location with id ${id} not found`);
      return false;
    }
    
    // Delete the location
    await sql`
      DELETE FROM travel_locations
      WHERE trim(id::text) = trim(${id}::text)
    `;
    
    console.log(`Successfully deleted location ${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting location:', error);
    return false;
  }
}

// Get a single location by ID
export async function getLocationById(id: string): Promise<TravelLocation | null> {
  const sql = getDb();
  
  const rows = await sql`
    SELECT id, name, city, country, state, visited, date, description, photos, lat, lng
    FROM travel_locations
    WHERE id = ${id}
  `;
  
  if (rows.length === 0) return null;
  
  const row = rows[0];
  const lat = typeof row.lat === 'string' ? parseFloat(row.lat) : row.lat;
  const lng = typeof row.lng === 'string' ? parseFloat(row.lng) : row.lng;
  
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    country: row.country,
    state: row.state,
    visited: row.visited,
    date: row.date,
    description: row.description,
    photos: row.photos || [],
    coordinates: {
      lat: Number(lat),
      lng: Number(lng),
    },
  };
}

