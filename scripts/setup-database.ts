import { neon } from '@neondatabase/serverless';
import { promises as fs } from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.development.local' });

async function setupDatabase() {
  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL not found in environment variables');
    console.error('Make sure .env.development.local exists with POSTGRES_URL');
    process.exit(1);
  }
  
  const sql = neon(process.env.POSTGRES_URL);

  console.log('🚀 Setting up database...');

  // Create travel_locations table
  await sql`
    CREATE TABLE IF NOT EXISTS travel_locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT,
      country TEXT NOT NULL,
      state TEXT,
      visited BOOLEAN DEFAULT true,
      date TEXT,
      description TEXT,
      photos TEXT[], -- Array of photo URLs
      lat DECIMAL(10, 8) NOT NULL,
      lng DECIMAL(11, 8) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  console.log('✅ Table created successfully!');

  // Migrate existing data from JSON file
  try {
    const jsonPath = path.join(process.cwd(), 'data', 'travel-locations.json');
    const jsonData = await fs.readFile(jsonPath, 'utf-8');
    const locations = JSON.parse(jsonData);

    console.log(`📦 Found ${locations.length} locations in JSON file`);

    for (const location of locations) {
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
    }

    console.log(`✅ Migrated ${locations.length} locations to database!`);
  } catch (error) {
    console.log('ℹ️  No existing JSON file to migrate (this is fine for new setups)');
  }

  // Verify
  const count = await sql`SELECT COUNT(*) FROM travel_locations`;
  console.log(`\n🎉 Database setup complete! Total locations: ${count[0].count}`);
}

setupDatabase().catch(console.error);

