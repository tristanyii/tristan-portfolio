"use client";

import { useState, useEffect, useRef } from "react";
import { X, MapPin, Camera, Plus, Globe, Settings, Save, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorldMapVisual } from "./world-map-visual";
import { USAMapVisual } from "./usa-map-visual";

interface PhotoWithDescription {
  url: string;
  description?: string;
}

interface TravelLocation {
  id: string;
  name: string; // Display name (can be city name or full location)
  city?: string; // City name
  country: string;
  state?: string; // For US locations
  visited: boolean;
  date?: string;
  photos?: (string | PhotoWithDescription)[]; // Support both old format (string) and new format (PhotoWithDescription)
  coordinates: { lat: number; lng: number };
}

// Default travel data (used as fallback if database is empty)
const defaultTravelData: TravelLocation[] = [
  {
    id: "1",
    name: "Durham",
    city: "Durham",
    country: "USA",
    state: "North Carolina",
    visited: true,
    date: "2024-Present",
    coordinates: { lat: 35.9940, lng: -78.8986 },
    photos: ["/Headshot.jpg", "/MirrorPic.jpg"],
  },
  {
    id: "2",
    name: "Union",
    city: "Union",
    country: "USA",
    state: "South Carolina",
    visited: true,
    date: "Home",
    coordinates: { lat: 34.7154, lng: -81.6234 },
    photos: ["/GreatAunt.jpg"],
  },
  {
    id: "3",
    name: "Charlotte",
    city: "Charlotte",
    country: "USA",
    state: "North Carolina",
    visited: true,
    date: "2023-2024",
    coordinates: { lat: 35.2271, lng: -80.8431 },
    photos: ["/Carowinds.jpg"],
  },
];

// US States that have been visited (derived from travelData)
const getVisitedUSStates = (travelData: TravelLocation[]) => {
  const states = new Set<string>();
  travelData.forEach(location => {
    if (location.country === "USA" && location.state && location.visited) {
      states.add(location.state);
      console.log('✅ Adding visited state:', location.state, 'from location:', location.name);
    }
  });
  console.log('🗺️ Visited US States:', Array.from(states));
  return states;
};

// Countries that have been visited (derived from travelData)
const getVisitedCountries = (travelData: TravelLocation[]) => {
  const countries = new Set<string>();
  travelData.forEach(location => {
    if (location.visited) {
      countries.add(location.country);
    }
  });
  return countries;
};

interface TravelMapProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TravelMap({ isOpen, onClose }: TravelMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<TravelLocation | null>(null);
  const [selectedRegionLocations, setSelectedRegionLocations] = useState<TravelLocation[] | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"world" | "usa">("usa");
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [editingLocation, setEditingLocation] = useState<TravelLocation | null>(null);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [tapTimeout, setTapTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [travelData, setTravelData] = useState<TravelLocation[]>(defaultTravelData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [autoGeocodeTimeout, setAutoGeocodeTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Load locations from database
  useEffect(() => {
    if (isOpen) {
      loadLocations();
    }
  }, [isOpen]);

  const loadLocations = async () => {
    try {
      const response = await fetch('/api/travel-locations');
      const data = await response.json();
      
      if (data.locations && data.locations.length > 0) {
        // Normalize photos - convert string arrays to PhotoWithDescription format
        const normalizedLocations = data.locations.map((loc: TravelLocation) => {
          if (loc.photos && Array.isArray(loc.photos)) {
            const normalizedPhotos = loc.photos.map((photo: any) => {
              // Handle string format - could be plain URL or JSON string
              if (typeof photo === 'string') {
                // Check if it's a JSON string (object stored as string in database)
                if (photo.trim().startsWith('{') && photo.includes('"url"')) {
                  try {
                    const parsed = JSON.parse(photo);
                    const url = parsed.url || '';
                    if (url && typeof url === 'string') {
                      return { url: url.trim(), description: parsed.description || '' };
                    }
                  } catch (e) {
                    console.warn('Failed to parse photo JSON string:', photo);
                  }
                }
                // Plain string URL
                return { url: photo.trim(), description: '' };
              }
              
              // Handle object format
              if (photo && typeof photo === 'object') {
                // Check if it's already in PhotoWithDescription format
                if ('url' in photo) {
                  const url = photo.url || '';
                  if (url && typeof url === 'string') {
                    return { url: url.trim(), description: photo.description || '' };
                  }
                }
                // Try to extract URL from other properties
                const possibleUrl = photo.url || photo.path || photo.src || '';
                if (possibleUrl && typeof possibleUrl === 'string') {
                  return { url: possibleUrl.trim(), description: photo.description || '' };
                }
              }
              
              // Invalid format - log and skip
              console.warn('Invalid photo format found:', typeof photo, photo);
              return null;
            }).filter((photo: any) => photo !== null && photo.url && typeof photo.url === 'string' && photo.url.trim()); // Filter out nulls and invalid URLs
            
            console.log(`📸 Normalized ${normalizedPhotos.length} photos for location ${loc.name}:`, normalizedPhotos);
            return { ...loc, photos: normalizedPhotos };
          }
          return loc;
        });
        
        setTravelData(normalizedLocations);

        // One-time migration: ensure Durham, North Carolina has MirrorPic with description
        try {
          const durham = normalizedLocations.find((loc: TravelLocation) =>
            (loc.city?.toLowerCase() === 'durham' || loc.name.toLowerCase() === 'durham') &&
            (loc.state?.toLowerCase() === 'north carolina' || loc.country === 'USA')
          );
          if (durham) {
            const photos = (durham.photos || []) as PhotoWithDescription[];
            const idx = photos.findIndex(p => (typeof p === 'string' ? p : p.url) === '/MirrorPic.jpg');
            const hasDesc = idx >= 0 && typeof photos[idx] !== 'string' && (photos[idx] as PhotoWithDescription).description && (photos[idx] as PhotoWithDescription).description!.trim().length > 0;
            if (idx >= 0 && !hasDesc) {
              const photoUrl = typeof photos[idx] === 'string' ? (photos[idx] as unknown as string) : (photos[idx] as PhotoWithDescription).url;
              const updated: TravelLocation = {
                ...durham,
                photos: photos.map((p, i) => {
                  if (i !== idx) return typeof p === 'string' ? { url: p, description: '' } : p;
                  return { url: photoUrl, description: 'beabadoobee concert' };
                })
              };
              // Save silently; ignore errors
              fetch('/api/travel-locations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
              }).catch(() => {});
            } else if (idx === -1) {
              // Add if missing entirely
              const updated: TravelLocation = {
                ...durham,
                photos: [...photos.map(p => (typeof p === 'string' ? { url: p, description: '' } : p)), { url: '/MirrorPic.jpg', description: 'beabadoobee concert' }]
              };
              fetch('/api/travel-locations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
              }).catch(() => {});
            }
          }
        } catch {}
        
        // Update selectedLocation if it exists in the reloaded data
        if (selectedLocation) {
          const updatedSelected = normalizedLocations.find((loc: TravelLocation) => loc.id === selectedLocation.id);
          if (updatedSelected) {
            setSelectedLocation(updatedSelected);
          }
        } else {
          // Auto-select first location with photos, or first location if none have photos
          const locationWithPhotos = normalizedLocations.find((loc: TravelLocation) => loc.visited && loc.photos && loc.photos.length > 0);
          const firstLocation = normalizedLocations.find((loc: TravelLocation) => loc.visited);
          if (locationWithPhotos) {
            setSelectedLocation(locationWithPhotos);
          } else if (firstLocation) {
            setSelectedLocation(firstLocation);
          }
        }
      } else {
        // If no locations in database, save the defaults
        await saveInitialLocations();
        // Auto-select first default location
        if (defaultTravelData.length > 0 && !selectedLocation) {
          setSelectedLocation(defaultTravelData[0]);
        }
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveInitialLocations = async () => {
    for (const location of defaultTravelData) {
      try {
        // Normalize photos in default data
        const normalizedLocation = {
          ...location,
          photos: location.photos?.map(photo => {
            if (typeof photo === 'string') {
              return { url: photo, description: '' };
            }
            return photo;
          }) || []
        };
        await fetch('/api/travel-locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(normalizedLocation),
        });
      } catch (error) {
        console.error('Error saving initial location:', error);
      }
    }
    // Normalize default data for state
    const normalizedDefaults = defaultTravelData.map(loc => ({
      ...loc,
      photos: loc.photos?.map(photo => typeof photo === 'string' ? { url: photo, description: '' } : photo) || []
    }));
    setTravelData(normalizedDefaults);
  };

  // Secret admin mode activation: Press Shift 5 times
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setKeySequence(prev => {
          const newSeq = [...prev, 'Shift'].slice(-5);
          if (newSeq.length === 5 && newSeq.every(k => k === 'Shift')) {
            setAdminMode(true);
            return [];
          }
          return newSeq;
        });
        
        // Reset sequence after 2 seconds
        setTimeout(() => setKeySequence([]), 2000);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Handle file upload
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
        return null;
      }

      const data = await response.json();
      return data.path;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    }
  };

  // Handle multiple files
  const handleFiles = async (files: FileList | null) => {
    if (!files || !editingLocation) return;

    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Please select image files only.');
      return;
    }

    // Add filenames to uploading state
    setUploadingImages(imageFiles.map(f => f.name));

    // Upload files one by one
    const uploadedPaths: string[] = [];
    for (const file of imageFiles) {
      const path = await uploadFile(file);
      if (path) {
        uploadedPaths.push(path);
      }
      // Remove from uploading list
      setUploadingImages(prev => prev.filter(name => name !== file.name));
    }

    // Add uploaded paths to location photos - convert strings to PhotoWithDescription format
    if (uploadedPaths.length > 0) {
      const newPhotos = uploadedPaths.map(path => ({ url: path, description: '' }));
      setEditingLocation({
        ...editingLocation,
        photos: [...(editingLocation.photos || []), ...newPhotos],
      });
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    await handleFiles(files);
  };

  const visitedCount = travelData.filter(loc => loc.visited).length;
  const visitedCountries = [...new Set(travelData.filter(loc => loc.visited).map(loc => loc.country))].length;
  const visitedStates = getVisitedUSStates(travelData);
  const visitedCountriesSet = getVisitedCountries(travelData);
  const locationRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleRegionClick = (regionName: string, isState: boolean = false) => {
    // Find location(s) in this region
    const locations = travelData.filter(loc => {
      if (isState) {
        return loc.state === regionName && loc.visited;
      } else {
        return loc.country === regionName && loc.visited;
      }
    });
    
    if (locations.length > 0) {
      setSelectedLocation(locations[0]); // Show first location in region
    }
  };

  // Handle map click to add new location (admin mode only)
  const handleMapClick = (coordinates: { lat: number; lng: number }, countryName: string, stateName?: string) => {
    if (!adminMode) return;

    // Create new location with clicked coordinates and detected country/state
    const newLocation: TravelLocation = {
      id: String(Date.now()),
      name: "", // Will be auto-generated from city + state/country
      city: "",
      country: countryName,
      state: stateName,
      visited: true,
      coordinates: coordinates,
      photos: [],
    };
    
    setEditingLocation(newLocation);
  };

  // Save location to database
  const saveLocationToDb = async (location: TravelLocation) => {
    setSaving(true);
    try {
      // Normalize photos before saving - ensure all are in PhotoWithDescription format
      const mappedPhotos = (location.photos || []).map(photo => {
        if (typeof photo === 'string') {
          // Validate string URL
          if (!photo || !photo.trim()) {
            console.warn('Empty photo URL found, skipping');
            return null;
          }
          return { url: photo.trim(), description: '' } as PhotoWithDescription;
        }
        // Ensure photo object has both url and description
        const photoObj = photo as any;
        const url = (photoObj.url || photoObj.path || photoObj.src || '').trim();
        if (!url) {
          console.warn('Photo object has no valid URL, skipping:', photoObj);
          return null;
        }
        return { url: url, description: photoObj.description || '' } as PhotoWithDescription;
      });
      
      const validPhotos = mappedPhotos.filter((photo): photo is PhotoWithDescription => 
        photo !== null && photo !== undefined && !!photo?.url
      );
      
      const normalizedLocation = {
        ...location,
        photos: validPhotos as (string | PhotoWithDescription)[]
      };
      
      console.log('💾 Saving location with normalized photos:', normalizedLocation.photos);

      const response = await fetch('/api/travel-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedLocation),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save location');
      }

      // Reload locations to reflect the save
      await loadLocations();
      
      // Update selectedLocation if it's the same location
      if (selectedLocation && selectedLocation.id === normalizedLocation.id) {
        setSelectedLocation(normalizedLocation);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving location:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save location. Please try again.';
      alert(`❌ ${errorMessage}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Delete location from database
  const deleteLocationFromDb = async (id: string) => {
    if (!confirm('⚠️ Are you sure you want to delete this location?\n\nThis action cannot be undone.')) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/travel-locations?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete location');
      }

      await loadLocations();
      setSelectedLocation(null);
      setEditingLocation(null);
    } catch (error) {
      console.error('Error deleting location:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete location. Please try again.';
      alert(`❌ ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  // Geocode city name to get coordinates
  const geocodeLocation = async (silent = false) => {
    const cityName = editingLocation?.city || editingLocation?.name;
    if (!editingLocation || !cityName) {
      if (!silent) alert('Please enter a city name first.');
      return;
    }

    setGeocoding(true);
    try {
      const params = new URLSearchParams({
        city: cityName,
        country: editingLocation.country || '',
        state: editingLocation.state || '',
      });

      const response = await fetch(`/api/geocode?${params}`);
      const data = await response.json();

      if (!response.ok) {
        if (!silent) {
          alert(data.message || 'Could not find location. Try being more specific or enter coordinates manually.');
        }
        return;
      }

      // Update coordinates
      setEditingLocation({
        ...editingLocation,
        coordinates: {
          lat: data.lat,
          lng: data.lng,
        },
      });

      // Show success message only if not silent
      if (!silent) {
        alert(`✅ Found coordinates!\n${data.displayName}`);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      if (!silent) {
        alert('Failed to find location coordinates. Please enter them manually.');
      }
    } finally {
      setGeocoding(false);
    }
  };

  // Handle secret admin mode activation via taps (mobile-friendly)
  const handleTitleTap = () => {
    // Clear existing timeout
    if (tapTimeout) {
      clearTimeout(tapTimeout);
    }

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    // If 5 taps, activate admin mode
    if (newTapCount >= 5) {
      setAdminMode(true);
      setTapCount(0);
      return;
    }

    // Reset tap count after 1 second of no taps
    const timeout = setTimeout(() => {
      setTapCount(0);
    }, 1000);
    setTapTimeout(timeout);
  };

  // Auto-geocode with debounce when location details change
  const triggerAutoGeocode = () => {
    // Clear existing timeout
    if (autoGeocodeTimeout) {
      clearTimeout(autoGeocodeTimeout);
    }

    // Set new timeout for auto-geocode (wait 1.5 seconds after user stops typing)
    const timeout = setTimeout(() => {
      const cityName = editingLocation?.city || editingLocation?.name;
      if (editingLocation && cityName && cityName.length > 2) {
        geocodeLocation(true); // Silent mode - no alerts
      }
    }, 1500);

    setAutoGeocodeTimeout(timeout);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoGeocodeTimeout) {
        clearTimeout(autoGeocodeTimeout);
      }
      if (tapTimeout) {
        clearTimeout(tapTimeout);
      }
    };
  }, [autoGeocodeTimeout, tapTimeout]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Early return AFTER all hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      <div className="h-full flex flex-col">
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-lg text-muted-foreground">Loading cities I've been...</p>
            </div>
          </div>
        )}

        {/* Compact Header */}
        <div className="px-3 py-2 border-b backdrop-blur-lg bg-background/50">
          <div className="container mx-auto flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 
                className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent truncate cursor-pointer select-none"
                onClick={handleTitleTap}
                title="Tap 5 times quickly for admin mode"
              >
                Places I've Been ✈️
              </h2>
              <div className="flex gap-1.5 mt-0.5 flex-wrap">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  📍 {visitedCount}
                </Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  🌎 {visitedCountries}
                </Badge>
                {visitedCountriesSet.has("USA") && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    🇺🇸 {visitedStates.size}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-1 items-center flex-shrink-0">
              {/* Admin Mode Indicator */}
              {adminMode && (
                <Badge variant="destructive" className="animate-pulse text-[10px] px-1.5 py-0">
                  <Settings className="h-2.5 w-2.5 mr-0.5" />
                  <span className="hidden sm:inline">Admin</span>
                </Badge>
              )}
              {/* View Mode Toggle */}
              <Button
                variant={viewMode === "world" ? "default" : "outline"}
                onClick={() => setViewMode("world")}
                size="sm"
                className="gap-1 px-1.5 h-7 text-xs"
              >
                <Globe className="h-3 w-3" />
                <span className="hidden sm:inline">World</span>
              </Button>
              {visitedCountriesSet.has("USA") && (
                <Button
                  variant={viewMode === "usa" ? "default" : "outline"}
                  onClick={() => setViewMode("usa")}
                  size="sm"
                  className="gap-1 px-1.5 h-7 text-xs"
                >
                  <span>🇺🇸</span>
                  <span className="hidden sm:inline">USA</span>
                </Button>
              )}
              {/* Secret Admin Button - only visible in admin mode */}
              {adminMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdminMode(false)}
                  className="gap-1 border-red-500/50 px-1.5 h-7 text-xs"
                >
                  <Settings className="h-3 w-3" />
                  <span className="hidden sm:inline">Exit</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-primary/10 h-7 w-7 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Map and Photo Album Layout */}
        <div className={`flex-1 relative overflow-hidden min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] flex flex-col md:flex-row`}>
          {/* Map Section - Adjusts width when photo panel is open */}
          <div className={`relative overflow-hidden transition-all duration-300 flex-shrink-0 ${selectedLocation ? 'w-full h-[50vh] md:h-full md:w-1/2 lg:w-3/5' : 'w-full md:w-1/2 lg:w-3/5 h-full'}`}>
          <div className="absolute inset-0">
              <div className="text-center pt-2 md:pt-4 pb-2 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-background/90 to-transparent px-4 pointer-events-none">
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {adminMode 
                  ? "🎯 Click map to add location"
                  : viewMode === "world" 
                    ? "🗺️ Click pins for photos"
                    : "🗺️ Click pins for photos"}
              </p>
            </div>
            
              <div className="absolute inset-0">
              {viewMode === "world" ? (
                <WorldMapVisual 
                  visitedCountries={visitedCountriesSet} 
                  onCountryClick={(country) => handleRegionClick(country, false)}
                  cityMarkers={travelData.filter(loc => loc.visited).map(loc => ({
                    name: loc.name,
                    coordinates: [loc.coordinates.lng, loc.coordinates.lat] as [number, number],
                    hasPhotos: !!(loc.photos && loc.photos.length > 0)
                  }))}
                  onMarkerClick={(cityName) => {
                    const location = travelData.find(loc => loc.name === cityName);
                    if (location) {
                      // Always open the details modal; when in admin mode the modal shows Edit/Delete
                        setSelectedLocation(location);
                    }
                  }}
                  onMapClick={adminMode ? handleMapClick : undefined}
                  adminMode={adminMode}
                />
              ) : (
                <USAMapVisual 
                  visitedStates={visitedStates} 
                  onStateClick={(state) => handleRegionClick(state, true)}
                  cityMarkers={travelData.filter(loc => loc.country === "USA" && loc.visited).map(loc => ({
                    name: loc.name,
                    coordinates: [loc.coordinates.lng, loc.coordinates.lat] as [number, number],
                    hasPhotos: !!(loc.photos && loc.photos.length > 0)
                  }))}
                  onMarkerClick={(cityName) => {
                    const location = travelData.find(loc => loc.name === cityName);
                    if (location) {
                        setSelectedLocation(location);
                    }
                  }}
                  onMapClick={adminMode ? handleMapClick : undefined}
                  adminMode={adminMode}
                />
              )}
            </div>
          </div>
        </div>

          {/* Photo Album Side Panel - Always visible on desktop */}
          {selectedLocation ? (
            <div className="flex-shrink-0 w-full md:w-1/2 lg:w-2/5 md:border-l border-t md:border-t-0 border-border bg-background overflow-y-auto animate-slide-in-right h-[50vh] md:h-full flex flex-col relative z-10">
              <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b p-2.5 md:p-3 z-10">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent truncate">
                      {selectedLocation.name}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-red-500 flex-shrink-0" />
                      <span className="truncate">
                        {selectedLocation.state ? `${selectedLocation.state}, ` : ""}{selectedLocation.country}
                        {selectedLocation.date && ` • ${selectedLocation.date}`}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {/* Edit Button (Admin Mode) */}
                    {adminMode && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingLocation(selectedLocation);
                          setSelectedLocation(null);
                        }}
                        className="rounded-full hover:bg-primary/10 border-primary/50 h-7 w-7"
                        title="Edit location"
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteLocationFromDb(selectedLocation.id)}
                      className="rounded-full h-7 w-7"
                      title="Delete location"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedLocation(null)}
                      className="rounded-full hover:bg-primary/10 h-7 w-7"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-2.5 md:p-3">
                {/* Photo Gallery */}
                {selectedLocation.photos && selectedLocation.photos.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Camera className="h-3.5 w-3.5 text-primary" />
                        <h4 className="font-semibold text-sm md:text-base">
                          Photos ({selectedLocation.photos.length})
                        </h4>
                      </div>
                      {adminMode && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingLocation(selectedLocation);
                            setSelectedLocation(null);
                          }}
                          className="gap-1 text-xs h-7 px-2"
                        >
                          <ImageIcon className="h-3 w-3" />
                          <span className="hidden sm:inline">Manage</span>
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                      {selectedLocation.photos?.map((photo, index) => {
                        // Extract photo URL - handle both string and object formats
                        let photoUrl: string = '';
                        let photoDescription: string | undefined;
                        
                        if (typeof photo === 'string') {
                          photoUrl = photo;
                          photoDescription = undefined;
                        } else if (photo && typeof photo === 'object') {
                          // Try to get URL from various possible properties
                          const photoObj = photo as any;
                          // CRITICAL: Extract ONLY the url property, not the entire object
                          photoUrl = photoObj.url || photoObj.path || photoObj.src || '';
                          photoDescription = photoObj.description;
                          
                          // Safety check: if url contains JSON-looking string, extract it properly
                          if (photoUrl && photoUrl.includes('{') && photoUrl.includes('url')) {
                            try {
                              const parsed = JSON.parse(photoUrl);
                              photoUrl = parsed.url || '';
                              photoDescription = parsed.description || photoDescription;
                            } catch (e) {
                              console.error('Error parsing malformed photo URL:', photoUrl);
                            }
                          }
                        } else {
                          // If photo is something unexpected, log and skip
                          console.error('Unexpected photo format at index', index, ':', typeof photo, photo);
                          return null;
                        }
                        
                        // Skip if no valid URL
                        if (!photoUrl || !photoUrl.trim()) {
                          console.warn('Photo at index', index, 'has no valid URL. Photo object:', photo);
                          return null;
                        }
                        
                        // Final validation - ensure photoUrl is a clean string
                        photoUrl = String(photoUrl || '').trim();
                        
                        // If photoUrl looks like JSON or contains encoded JSON, try to parse it
                        if (photoUrl && (photoUrl.startsWith('{') || photoUrl.includes('%22') || photoUrl.includes('"url"') || photoUrl.includes('description'))) {
                          try {
                            // Try to decode if URL-encoded
                            let decoded = photoUrl;
                            if (photoUrl.includes('%22')) {
                              try {
                                decoded = decodeURIComponent(photoUrl);
                                console.log('🔓 Decoded URL-encoded string:', decoded);
                              } catch (decodeError) {
                                console.warn('Failed to decode URL:', photoUrl);
                              }
                            }
                            
                            // If it looks like partial JSON (missing opening brace), try to reconstruct it
                            if (decoded.includes('"url"') || decoded.includes('description')) {
                              if (!decoded.trim().startsWith('{')) {
                                // Might be partial JSON - try to reconstruct
                                if (decoded.includes('"url"') || decoded.includes('url')) {
                                  // Try to extract URL directly from the string
                                  const urlMatch = decoded.match(/"url"\s*:\s*"([^"]+)"/) || decoded.match(/url["\s:]+"([^"]+)"/);
                                  if (urlMatch && urlMatch[1]) {
                                    photoUrl = urlMatch[1];
                                    console.log('✅ Extracted URL from partial JSON:', photoUrl);
                                  }
                                }
                              } else {
                                // Full JSON - parse it
                                const parsed = JSON.parse(decoded);
                                photoUrl = String(parsed.url || parsed.path || parsed.src || '').trim();
                                if (!photoDescription && parsed.description) {
                                  photoDescription = parsed.description;
                                }
                                console.log('✅ Parsed JSON photo object:', { url: photoUrl, description: photoDescription });
                              }
                            }
                          } catch (e) {
                            console.error('❌ Failed to parse photo URL:', photoUrl, e);
                            // Try one more time - extract URL from string directly
                            const urlMatch = photoUrl.match(/MirrorPic\.jpg|Headshot\.jpg|Carowinds\.jpg|Selfie\.jpg|([^",\s]+\.jpg)/i);
                            if (urlMatch && urlMatch[0]) {
                              photoUrl = '/' + urlMatch[0].replace(/^\//, '');
                              console.log('🔄 Extracted filename from malformed string:', photoUrl);
                            }
                          }
                        }
                        
                        // Skip if still no valid URL
                        if (!photoUrl || !photoUrl.trim() || photoUrl.includes('{')) {
                          console.error('❌ Invalid photo URL after processing:', photoUrl, 'Original photo:', photo);
                          return null;
                        }
                        
                        // Log the extracted URL for debugging
                        console.log(`✅ Photo ${index}: URL="${photoUrl}", Description="${photoDescription || 'none'}"`);
                        
                        return (
                        <div 
                          key={index} 
                          className="group relative overflow-hidden rounded-lg bg-muted cursor-pointer aspect-square"
                          onClick={() => setLightboxPhoto(photoUrl)}
                        >
                          <img
                            src={photoUrl}
                            alt={`${selectedLocation.name} photo ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              console.error('❌ Failed to load photo:', {
                                attemptedUrl: photoUrl,
                                originalPhoto: photo,
                                location: selectedLocation.name,
                                index: index
                              });
                              const img = e.target as HTMLImageElement;
                              img.style.display = 'none';
                              const parent = img.parentElement;
                              if (parent && !parent.querySelector('.error-placeholder')) {
                                const errorDiv = document.createElement('div');
                                errorDiv.className = 'error-placeholder w-full h-full flex items-center justify-center bg-red-100 text-xs text-red-600';
                                errorDiv.textContent = '404';
                                parent.appendChild(errorDiv);
                              }
                            }}
                            onLoad={() => {
                              console.log('✅ Successfully loaded photo:', photoUrl);
                            }}
                          />
                          {photoDescription && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5 pointer-events-none">
                              <p className="text-white text-[9px] leading-tight line-clamp-2">{photoDescription}</p>
                            </div>
                          )}
                          {adminMode && (
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentDescription = photoDescription || '';
                                  const newDescription = prompt('Add/edit photo description:', currentDescription);
                                  if (newDescription !== null) {
                                    const updatedPhotos = [...(selectedLocation.photos || [])];
                                    updatedPhotos[index] = { url: photoUrl, description: newDescription };
                                    const updatedLocation = { ...selectedLocation, photos: updatedPhotos };
                                    // Update local state immediately for better UX
                                    setSelectedLocation(updatedLocation);
                                    // Then save to database
                                    saveLocationToDb(updatedLocation);
                                  }
                                }}
                                className="gap-1 h-6 text-[10px] bg-background px-1.5"
                              >
                                <ImageIcon className="h-2.5 w-2.5" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete this photo?`)) {
                                    const updatedLocation = {
                                      ...selectedLocation,
                                      photos: selectedLocation.photos?.filter((_, i) => i !== index)
                                    };
                                    saveLocationToDb(updatedLocation).then(success => {
                                      if (success) {
                                        setSelectedLocation(updatedLocation);
                                      }
                                    });
                                  }
                                }}
                                className="gap-1 h-6 text-[10px] px-1.5"
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                                Del
                              </Button>
                            </div>
                          )}
                        </div>
                      )})}
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
                    <Camera className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground mb-2">No photos yet</p>
                    {adminMode ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingLocation(selectedLocation);
                          setSelectedLocation(null);
                        }}
                        className="mt-2 h-8 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Add Photos
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground/60">
                        Check back later for photos
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // State/Country Cards Panel when no location selected
            <div className="flex-shrink-0 w-full md:w-1/2 lg:w-2/5 md:border-l border-t md:border-t-0 border-border bg-background overflow-y-auto h-[50vh] md:h-full flex flex-col relative">
              <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b p-2.5 md:p-3 z-10">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Photos
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Click a card or pin to view photos</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2.5 md:p-3">
                <div className="space-y-3">
            {(() => {
              // Group locations by country first, then by state
              const byCountry: { [country: string]: { [region: string]: TravelLocation[] } } = {};
              
              travelData.forEach((location) => {
                const country = location.country || 'Unknown';
                const region = location.state || country; // Use state if available, otherwise country
                
                if (!byCountry[country]) {
                  byCountry[country] = {};
                }
                if (!byCountry[country][region]) {
                  byCountry[country][region] = [];
                }
                byCountry[country][region].push(location);
              });

              return Object.entries(byCountry).map(([country, regions]) => (
                <div key={country} className="space-y-2">
                  {/* Country Header (only show if more than one country OR if viewing international) */}
                  {(Object.keys(byCountry).length > 1 || country !== 'USA') && (
                    <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide px-0.5 mb-1">
                      {country === 'USA' ? '🇺🇸 United States' : `🌍 ${country}`}
                    </h3>
                  )}
                  
                  {/* Region Cards - Small square cards in album view */}
                  <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
                    {Object.entries(regions).map(([region, locations]) => {
                      const locationArray: TravelLocation[] = locations as TravelLocation[];
                      const allPhotos = locationArray.flatMap(loc => {
                        const locPhotos = loc.photos || [];
                        return locPhotos.map(photo => typeof photo === 'string' ? photo : photo.url);
                      });
                      const photoCount = allPhotos.length;
                      const displayPhotos = allPhotos.slice(0, 4);
                      const displayName = region === country ? country : region; // Don't repeat country name
                      
                      return (
                        <div
                          key={region}
                          className={`relative group ${
                            selectedLocation && locationArray.some(loc => loc.id === (selectedLocation as TravelLocation).id)
                              ? 'ring-2 ring-primary rounded-lg'
                              : ''
                          }`}
                        >
                          {/* Region Card - Small Square */}
                          <div 
                            className="w-full aspect-square rounded-md overflow-hidden border border-primary/20 hover:border-primary/50 hover:shadow-lg hover:scale-105 transition-all bg-muted/50 backdrop-blur cursor-pointer"
                            onClick={() => {
                              // Show all locations in this region
                              setSelectedRegionLocations(locations);
                            }}
                          >
                            {photoCount > 0 ? (
                              <div className={`grid h-full ${
                                photoCount === 1 ? 'grid-cols-1' : 
                                photoCount === 2 ? 'grid-cols-2' : 
                                photoCount === 3 ? 'grid-cols-3' :
                                'grid-cols-2 grid-rows-2'
                              } gap-0.5`}>
                                {displayPhotos.map((photo, idx) => (
                                  <div key={idx} className="relative overflow-hidden bg-muted">
                                    <img
                                      src={photo}
                                      alt=""
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <MapPin className="h-10 w-10 text-muted-foreground/30" />
                              </div>
                            )}
                            
                            {/* Gradient Overlay with Info - More compact */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-1.5 pointer-events-none">
                              <p className="text-white font-bold text-[10px] truncate drop-shadow-lg leading-tight">
                                {displayName}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <p className="text-white/95 text-[8px] font-medium leading-tight">
                                {locations.length} {locations.length === 1 ? 'city' : 'cities'}
                                </p>
                                {photoCount > 0 && (
                                  <p className="text-white/90 text-[8px] font-medium leading-tight">
                                    {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
                                  </p>
                                    )}
                                  </div>
                                    </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add Location Button (only in this country section if in admin mode) */}
                    {adminMode && (
                      <Button
                        variant="outline"
                        className="w-full aspect-square gap-0.5 border-dashed border-green-500/50 hover:border-green-500 hover:bg-green-500/5 transition-all flex flex-col items-center justify-center"
                        onClick={() => {
                          const newLocation: TravelLocation = {
                            id: String(Date.now()),
                            name: "", // Will be auto-generated from city + state/country
                            city: "",
                            country: country,
                            visited: true,
                            coordinates: { lat: 35.9940, lng: -78.8986 },
                            photos: [],
                          };
                          setEditingLocation(newLocation);
                        }}
                      >
                        <Plus className="h-4 w-4 text-green-600" />
                        <span className="text-[9px] font-medium">Add</span>
                      </Button>
                    )}
                  </div>
                </div>
              ));
            })()}
          </div>
              </div>
            </div>
          )}
        </div>

        {/* Region Locations Modal - Shows ALL locations in a region */}
        {selectedRegionLocations && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 animate-fade-in"
               onClick={() => setSelectedRegionLocations(null)}>
            <div className="max-w-5xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto bg-background rounded-xl md:rounded-2xl shadow-2xl"
                 onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b p-4 md:p-6 z-10">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent truncate">
                      {selectedRegionLocations[0].state || selectedRegionLocations[0].country}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mt-1">
                      {selectedRegionLocations.length} {selectedRegionLocations.length === 1 ? 'city' : 'cities'} • {selectedRegionLocations.reduce((sum, loc) => sum + (loc.photos?.length || 0), 0)} photos
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedRegionLocations(null)}
                    className="rounded-full hover:bg-primary/10 h-8 w-8 md:h-10 md:w-10 flex-shrink-0"
                  >
                    <X className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </div>
              </div>

              {/* Quick nav chips for locations in this region */}
              <div className="px-4 md:px-6 pt-3">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {selectedRegionLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => locationRefs.current[loc.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      className="whitespace-nowrap text-xs md:text-sm px-3 py-1.5 rounded-full border bg-background hover:bg-primary/5"
                    >
                      {loc.city || loc.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 md:p-6 space-y-8">
                {/* Show each location with its photos */}
                {selectedRegionLocations.map((location) => (
                  <div
                    key={location.id}
                    ref={(el) => {
                      locationRefs.current[location.id] = el;
                    }}
                    className="space-y-4"
                  >
                    {/* Location Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-red-500" />
                          {location.name}
                        </h4>
                        {location.date && (
                          <p className="text-sm text-muted-foreground mt-1">{location.date}</p>
                        )}
                      </div>
                      {adminMode && (
                        <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingLocation(location);
                            setSelectedRegionLocations(null);
                          }}
                          className="gap-1"
                        >
                          <Settings className="h-3 w-3" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteLocationFromDb(location.id)}
                            className="gap-1"
                            title="Delete location"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Photos Grid */}
                    {location.photos && location.photos.length > 0 ? (
                      <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                        {location.photos.map((photo, index) => {
                          const photoUrl = typeof photo === 'string' ? photo : photo.url;
                          return (
                          <div 
                            key={index} 
                            className="group relative overflow-hidden rounded-lg aspect-square bg-muted cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxPhoto(photoUrl);
                            }}
                          >
                            <img
                              src={photoUrl}
                              alt={`${location.name} photo ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                              decoding="async"
                            />
                              </div>
                        )})}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No photos for this location yet</p>
                    )}

                    {/* Divider between locations */}
                    {selectedRegionLocations.indexOf(location) < selectedRegionLocations.length - 1 && (
                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mt-6"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* Admin Location Editor Modal */}
        {editingLocation && adminMode && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
               onClick={() => setEditingLocation(null)}>
            <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl border-2 border-primary/40"
                 onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b p-6 z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                      <Settings className="h-6 w-6" />
                      {editingLocation.id && travelData.find(loc => loc.id === editingLocation.id) 
                        ? 'Edit Location' 
                        : 'Add New Location'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {editingLocation.id && travelData.find(loc => loc.id === editingLocation.id)
                        ? 'Update travel information'
                        : 'Add a new city you\'ve visited'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingLocation(null)}
                    className="rounded-full hover:bg-primary/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Instructions - Updated */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-bold mb-2">
                    💡 How to Add a Location:
                  </p>
                  <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1.5 ml-4 list-disc">
                    <li><strong>City:</strong> Enter the city you visited (e.g., "Lancaster", "Charlotte", "Tokyo", "Seoul")</li>
                    <li><strong>State:</strong> REQUIRED for USA - enter the full state name (e.g., "Pennsylvania", "North Carolina") to turn it green on the map</li>
                    <li><strong>Country:</strong> Enter the country (e.g., "USA", "South Korea", "Japan", "France") to turn it green on the world map</li>
                    <li><strong>Display Name:</strong> Auto-generated as "City, State" (USA) or "City, Country" (international)</li>
                    <li>Coordinates auto-fill as you type. Click "Save Location" when done!</li>
                  </ul>
                </div>

                {/* Location Details Grid - City, State, Country */}
                <div className="space-y-4">
                  {/* City Name with Auto-Geocode */}
                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-primary">
                      🏙️ City <span className="text-red-500 text-base">*</span>
                      {geocoding && (
                        <span className="text-xs text-blue-500 flex items-center gap-1 font-normal">
                          <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full" />
                          Finding coordinates...
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={editingLocation.city || ""}
                      onChange={(e) => {
                        setEditingLocation({ 
                          ...editingLocation, 
                          city: e.target.value
                        });
                        triggerAutoGeocode();
                      }}
                      className="w-full px-4 py-3 bg-muted rounded-lg border-2 border-primary/30 focus:border-primary outline-none text-lg font-semibold"
                      placeholder="e.g., Lancaster, Charlotte, Tokyo, Seoul"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The city name only (e.g., "Lancaster" not "Lancaster, PA")
                    </p>
                  </div>

                  {/* State and Country Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        📍 State/Region {editingLocation.country === "USA" && <span className="text-red-500 text-base">*</span>}
                      </label>
                      <input
                        type="text"
                        value={editingLocation.state || ""}
                        onChange={(e) => {
                          setEditingLocation({ ...editingLocation, state: e.target.value });
                          triggerAutoGeocode();
                        }}
                        className={`w-full px-4 py-2 bg-muted rounded-lg border-2 ${
                          editingLocation.country === "USA" && !editingLocation.state
                            ? 'border-red-500 focus:border-red-600 animate-pulse'
                            : 'border-primary/20 focus:border-primary'
                        } outline-none`}
                        placeholder={editingLocation.country === "USA" ? "Pennsylvania" : "Optional"}
                      />
                      {editingLocation.country === "USA" && !editingLocation.state && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                          ⚠️ Required to turn state green!
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        🌍 Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingLocation.country}
                        onChange={(e) => {
                          setEditingLocation({ ...editingLocation, country: e.target.value });
                          triggerAutoGeocode();
                        }}
                        className="w-full px-4 py-2 bg-muted rounded-lg border-2 border-primary/20 focus:border-primary outline-none"
                        placeholder="USA"
                      />
                    </div>
                  </div>

                  {/* Display Name Preview */}
                  {editingLocation.city && editingLocation.country && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <p className="text-xs text-green-700 dark:text-green-300 font-bold">
                        ✅ Display Name (auto-generated):
                      </p>
                      <p className="text-sm font-semibold text-green-800 dark:text-green-200 mt-1">
                        📍 {editingLocation.city}{editingLocation.country === "USA" && editingLocation.state ? `, ${editingLocation.state}` : editingLocation.country !== "USA" ? `, ${editingLocation.country}` : ""}
                      </p>
                      {editingLocation.country === "USA" && editingLocation.state && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {editingLocation.state} will turn green on the map!
                        </p>
                      )}
                      {editingLocation.country !== "USA" && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {editingLocation.country} will turn green on the map!
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={editingLocation.coordinates.lat}
                      onChange={(e) => setEditingLocation({ 
                        ...editingLocation, 
                        coordinates: { ...editingLocation.coordinates, lat: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-4 py-2 bg-muted rounded-lg border-2 border-primary/20 focus:border-primary outline-none"
                      placeholder="e.g., 37.5665"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={editingLocation.coordinates.lng}
                      onChange={(e) => setEditingLocation({ 
                        ...editingLocation, 
                        coordinates: { ...editingLocation.coordinates, lng: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-4 py-2 bg-muted rounded-lg border-2 border-primary/20 focus:border-primary outline-none"
                      placeholder="e.g., 126.9780"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground -mt-2">
                  Or use "Find Coords" button above to auto-fill these fields
                </p>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">Date/Period</label>
                  <input
                    type="text"
                    value={editingLocation.date || ""}
                    onChange={(e) => setEditingLocation({ ...editingLocation, date: e.target.value })}
                    className="w-full px-4 py-2 bg-muted rounded-lg border-2 border-primary/20 focus:border-primary outline-none"
                    placeholder="e.g., Summer 2024 or 2024-Present"
                  />
                </div>


                {/* Photos - Drag & Drop Zone */}
                <div>
                  <label className="block text-sm font-medium mb-2">Photos</label>
                  
                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-primary bg-primary/10 scale-105'
                        : 'border-primary/30 hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFiles(e.target.files)}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <div className={`p-4 rounded-full bg-primary/10 ${isDragging ? 'animate-bounce' : ''}`}>
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {isDragging ? '📸 Drop your photos here!' : '📤 Drag & drop photos here'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          or click to browse • Max 10MB per image
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Uploading Progress */}
                  {uploadingImages.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadingImages.map((filename, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2">
                          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                          <span className="text-blue-700 dark:text-blue-300">Uploading {filename}...</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Current Photos with Thumbnails */}
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground">Uploaded Photos:</p>
                    {(editingLocation.photos || []).length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No photos yet. Drag some above!</p>
                    ) : (
                      (editingLocation.photos || []).map((photo, index) => {
                        const photoUrl = typeof photo === 'string' ? photo : photo.url;
                        const photoDesc = typeof photo === 'string' ? '' : (photo.description || '');
                        
                        return (
                        <div key={index} className="space-y-2 bg-muted/50 rounded-lg p-2">
                          <div className="flex gap-2 items-center">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                            <img
                                src={photoUrl}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">?</text></svg>';
                              }}
                            />
                          </div>
                          {/* Path */}
                          <input
                            type="text"
                              value={photoUrl}
                            onChange={(e) => {
                              const newPhotos = [...(editingLocation.photos || [])];
                                const currentPhoto = typeof photo === 'string' ? { url: photo, description: '' } : photo;
                                newPhotos[index] = { url: e.target.value, description: currentPhoto.description };
                              setEditingLocation({ ...editingLocation, photos: newPhotos });
                            }}
                            className="flex-1 px-3 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none text-sm"
                            placeholder="/photo.jpg"
                          />
                          {/* Delete Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newPhotos = (editingLocation.photos || []).filter((_, i) => i !== index);
                              setEditingLocation({ ...editingLocation, photos: newPhotos });
                            }}
                            className="border-red-500/50 hover:bg-red-500/10 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                          {/* Photo Description */}
                          <textarea
                            value={photoDesc}
                            onChange={(e) => {
                              const newPhotos = [...(editingLocation.photos || [])];
                              const currentPhoto = typeof photo === 'string' ? { url: photo, description: '' } : photo;
                              newPhotos[index] = { url: currentPhoto.url, description: e.target.value };
                              setEditingLocation({ ...editingLocation, photos: newPhotos });
                            }}
                            className="w-full px-3 py-2 bg-background rounded-lg border border-primary/20 focus:border-primary outline-none text-xs min-h-16"
                            placeholder="Add a description for this photo..."
                          />
                        </div>
                      )})
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={async () => {
                      const cityName = editingLocation?.city;
                      
                      // Validate city is entered
                      if (!cityName?.trim()) {
                        alert("⚠️ CITY REQUIRED!\n\nPlease enter a city name.");
                        return;
                      }
                      
                      // Validate USA locations have state
                      if (editingLocation.country === "USA" && !editingLocation.state?.trim()) {
                        alert("⚠️ STATE REQUIRED FOR USA LOCATIONS!\n\n" +
                              "You must enter both:\n" +
                              "• City: " + cityName + "\n" +
                              "• State: (e.g., Pennsylvania, North Carolina)\n\n" +
                              "This is required to:\n" +
                              "✓ Turn the state GREEN on the map\n" +
                              "✓ Group your locations correctly");
                        return;
                      }
                      
                      // Auto-generate display name: "City, State" for USA or "City, Country" for others
                      const displayName = editingLocation.country === "USA" && editingLocation.state
                        ? `${cityName}, ${editingLocation.state}`
                        : `${cityName}, ${editingLocation.country}`;
                      
                      // Validate coordinates
                      if (!editingLocation.coordinates || 
                          typeof editingLocation.coordinates.lat !== 'number' || 
                          typeof editingLocation.coordinates.lng !== 'number' ||
                          isNaN(editingLocation.coordinates.lat) ||
                          isNaN(editingLocation.coordinates.lng)) {
                        alert("⚠️ COORDINATES REQUIRED!\n\n" +
                              "Please:\n" +
                              "1. Click the 'Find on Map' button to auto-locate, OR\n" +
                              "2. Manually enter coordinates, OR\n" +
                              "3. Click directly on the map to set the location");
                        return;
                      }
                      
                      // Ensure all fields are set correctly
                      const locationToSave = {
                        ...editingLocation,
                        city: cityName,
                        name: displayName // Auto-generated from city + state/country
                      };
                      
                      console.log('💾 Saving location:', locationToSave);
                      const saved = await saveLocationToDb(locationToSave);
                      if (saved) {
                        console.log('✅ Location saved successfully!');
                        setEditingLocation(null);
                      }
                    }}
                    disabled={saving || !editingLocation?.city?.trim() || !editingLocation.country?.trim() || (editingLocation.country === "USA" && !editingLocation.state?.trim())}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Location
                      </>
                    )}
                  </Button>
                  
                  {/* Delete button if editing existing location */}
                  {editingLocation.id && travelData.find(loc => loc.id === editingLocation.id) && (
                    <Button
                      variant="outline"
                      onClick={() => deleteLocationFromDb(editingLocation.id)}
                      disabled={saving}
                      className="border-red-500/50 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                      Delete
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => setEditingLocation(null)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>

                {/* Optional: Show JSON for reference */}
                <details className="mt-4">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    Show JSON (for debugging)
                  </summary>
                  <pre className="bg-muted/50 border border-primary/20 rounded-lg p-3 text-xs overflow-x-auto mt-2">
                    {JSON.stringify(editingLocation, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox Modal for Full-Size Photo */}
        {lightboxPhoto && (
          <div 
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setLightboxPhoto(null)}
          >
            <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 text-white z-10"
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={lightboxPhoto}
                alt="Full size photo"
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
