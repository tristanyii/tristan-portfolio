import { promises as fs } from 'fs';
import path from 'path';

export interface TravelLocation {
  id: string;
  name: string;
  country: string;
  state?: string;
  visited: boolean;
  date?: string;
  description?: string;
  photos?: string[];
  coordinates: { lat: number; lng: number };
}

const DB_PATH = path.join(process.cwd(), 'data', 'travel-locations.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read all locations
export async function getAllLocations(): Promise<TravelLocation[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Save all locations
async function saveLocations(locations: TravelLocation[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DB_PATH, JSON.stringify(locations, null, 2), 'utf-8');
}

// Add or update a location
export async function saveLocation(location: TravelLocation): Promise<TravelLocation> {
  const locations = await getAllLocations();
  const existingIndex = locations.findIndex(loc => loc.id === location.id);
  
  if (existingIndex >= 0) {
    // Update existing
    locations[existingIndex] = location;
  } else {
    // Add new
    locations.push(location);
  }
  
  await saveLocations(locations);
  return location;
}

// Delete a location
export async function deleteLocation(id: string): Promise<boolean> {
  const locations = await getAllLocations();
  const filteredLocations = locations.filter(loc => loc.id !== id);
  
  if (filteredLocations.length === locations.length) {
    return false; // Location not found
  }
  
  await saveLocations(filteredLocations);
  return true;
}

// Get a single location by ID
export async function getLocationById(id: string): Promise<TravelLocation | null> {
  const locations = await getAllLocations();
  return locations.find(loc => loc.id === id) || null;
}

