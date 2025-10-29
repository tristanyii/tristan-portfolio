"use client";

import { useState, useEffect, useRef } from "react";
import { X, MapPin, Camera, Plus, Globe, Settings, Save, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorldMapVisual } from "./world-map-visual";
import { USAMapVisual } from "./usa-map-visual";

interface TravelLocation {
  id: string;
  name: string; // Display name (can be city name or full location)
  city?: string; // City name
  country: string;
  state?: string; // For US locations
  visited: boolean;
  date?: string;
  description?: string;
  photos?: string[];
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
    description: "Home at Duke University - studying Computer Science and Statistics",
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
    description: "My hometown where it all began",
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
    description: "Frequent visits to the Queen City",
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
        setTravelData(data.locations);
      } else {
        // If no locations in database, save the defaults
        await saveInitialLocations();
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
        await fetch('/api/travel-locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(location),
        });
      } catch (error) {
        console.error('Error saving initial location:', error);
      }
    }
    setTravelData(defaultTravelData);
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

    // Add uploaded paths to location photos
    if (uploadedPaths.length > 0) {
      setEditingLocation({
        ...editingLocation,
        photos: [...(editingLocation.photos || []), ...uploadedPaths],
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
      description: "Add your description here!",
    };
    
    setEditingLocation(newLocation);
  };

  // Save location to database
  const saveLocationToDb = async (location: TravelLocation) => {
    setSaving(true);
    try {
      const response = await fetch('/api/travel-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        throw new Error('Failed to save location');
      }

      // Reload locations to reflect the save
      await loadLocations();
      return true;
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Failed to save location. Please try again.');
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
        throw new Error('Failed to delete location');
      }

      await loadLocations();
      setSelectedLocation(null);
      setEditingLocation(null);
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location. Please try again.');
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoGeocodeTimeout) {
        clearTimeout(autoGeocodeTimeout);
      }
    };
  }, [autoGeocodeTimeout]);

  // Early return AFTER all hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg animate-fade-in">
      <div className="h-full flex flex-col">
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-lg text-muted-foreground">Loading places I've been...</p>
            </div>
          </div>
        )}

        {/* Compact Header */}
        <div className="px-4 py-3 border-b backdrop-blur-lg bg-background/50">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent truncate">
                Places I've Been ✈️
              </h2>
              <div className="flex gap-2 md:gap-3 mt-1 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  📍 {visitedCount}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🌎 {visitedCountries}
                </Badge>
                {visitedCountriesSet.has("USA") && (
                  <Badge variant="secondary" className="text-xs">
                    🗺️ {visitedStates.size}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-1 md:gap-2 items-center flex-shrink-0">
              {/* Admin Mode Indicator */}
              {adminMode && (
                <Badge variant="destructive" className="animate-pulse hidden md:flex">
                  <Settings className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
              {/* View Mode Toggle */}
              <Button
                variant={viewMode === "world" ? "default" : "outline"}
                onClick={() => setViewMode("world")}
                size="sm"
                className="gap-1 px-2 md:px-3"
              >
                <Globe className="h-3 w-3" />
                <span className="hidden sm:inline">World</span>
              </Button>
              {visitedCountriesSet.has("USA") && (
                <Button
                  variant={viewMode === "usa" ? "default" : "outline"}
                  onClick={() => setViewMode("usa")}
                  size="sm"
                  className="gap-1 px-2 md:px-3"
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
                  className="gap-1 border-red-500/50 hidden md:flex"
                >
                  <Settings className="h-3 w-3" />
                  Exit
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-primary/10 h-8 w-8 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* LARGE Interactive Map - Takes up most of the screen */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="text-center pt-2 md:pt-4 pb-2 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-background/90 to-transparent px-4">
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {adminMode 
                  ? "🎯 Click map to add location"
                  : viewMode === "world" 
                    ? "🗺️ Click pins for photos"
                    : "🗺️ Click pins for photos"}
              </p>
            </div>
            
            <div className="h-full w-full relative">
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
                      if (adminMode) {
                        setEditingLocation(location);
                      } else {
                        setSelectedLocation(location);
                      }
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
                      if (adminMode) {
                        setEditingLocation(location);
                      } else {
                        setSelectedLocation(location);
                      }
                    }
                  }}
                  onMapClick={adminMode ? handleMapClick : undefined}
                  adminMode={adminMode}
                />
              )}
            </div>
          </div>
        </div>

        {/* Compact Visual State/Country Grid */}
        <div className="border-t backdrop-blur-lg bg-background/80 p-2 md:p-3">
          <div className="container mx-auto space-y-2 md:space-y-3">
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
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                      {country === 'USA' ? '🇺🇸 United States' : `🌍 ${country}`}
                    </h3>
                  )}
                  
                  {/* Region Cards */}
                  <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
                    {Object.entries(regions).map(([region, locations]) => {
                      const allPhotos = locations.flatMap(loc => loc.photos || []);
                      const photoCount = allPhotos.length;
                      const displayPhotos = allPhotos.slice(0, 4);
                      const displayName = region === country ? country : region; // Don't repeat country name
                      
                      return (
                        <div
                          key={region}
                          className={`relative flex-shrink-0 group snap-start ${
                            selectedLocation && locations.some(loc => loc.id === selectedLocation.id)
                              ? 'ring-2 ring-primary rounded-lg'
                              : ''
                          }`}
                        >
                          {/* Region Card */}
                          <div 
                            className="w-32 h-24 md:w-36 md:h-28 rounded-lg overflow-hidden border border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all bg-muted/50 backdrop-blur cursor-pointer"
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
                            
                            {/* Gradient Overlay with Info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-2.5 pointer-events-none">
                              <p className="text-white font-bold text-sm truncate drop-shadow-lg">
                                {displayName}
                              </p>
                              <p className="text-white/90 text-[10px] font-medium">
                                {locations.length} {locations.length === 1 ? 'place' : 'places'}
                                {photoCount > 0 && ` • ${photoCount} ${photoCount === 1 ? 'photo' : 'photos'}`}
                              </p>
                            </div>
                          </div>
                          
                          {/* Hover Dropdown - Cities in this region */}
                          <div className="absolute top-full left-0 mt-2 w-52 bg-background/98 backdrop-blur-lg border border-primary/30 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                            <div className="p-2 border-b border-primary/20 bg-primary/5">
                              <p className="text-xs font-semibold text-primary">📍 {displayName}</p>
                            </div>
                            <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                              {locations.map((location) => (
                                <div
                                  key={location.id}
                                  className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-primary/10 text-sm group/item transition-colors"
                                >
                                  <MapPin className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                                  <div 
                                    className="flex-1 min-w-0 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (adminMode) {
                                        setEditingLocation(location);
                                      } else {
                                        setSelectedLocation(location);
                                      }
                                    }}
                                  >
                                    <p className="font-medium truncate">{location.name}</p>
                                    {location.date && (
                                      <p className="text-[10px] text-muted-foreground">{location.date}</p>
                                    )}
                                  </div>
                                  {location.photos && location.photos.length > 0 && (
                                    <div className="flex items-center gap-0.5 text-muted-foreground">
                                      <Camera className="h-3 w-3" />
                                      <span className="text-[10px]">{location.photos.length}</span>
                                    </div>
                                  )}
                                  {adminMode && (
                                    <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingLocation(location);
                                        }}
                                        title="Edit location"
                                      >
                                        <Settings className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 hover:bg-red-500/10"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteLocationFromDb(location.id);
                                        }}
                                        title="Delete location"
                                      >
                                        <Trash2 className="h-3 w-3 text-red-500" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add Location Button (only in this country section if in admin mode) */}
                    {adminMode && (
                      <Button
                        variant="outline"
                        className="flex-shrink-0 gap-1 border-dashed border-green-500/50 hover:border-green-500 hover:bg-green-500/5 h-28 w-36 transition-all"
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
                        <div className="flex flex-col items-center gap-2">
                          <Plus className="h-8 w-8 text-green-600" />
                          <span className="text-xs font-medium">Add Place</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Region Locations Modal - Shows ALL locations in a region */}
        {selectedRegionLocations && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 animate-fade-in"
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
                      {selectedRegionLocations.length} {selectedRegionLocations.length === 1 ? 'place' : 'places'} • {selectedRegionLocations.reduce((sum, loc) => sum + (loc.photos?.length || 0), 0)} photos
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

              <div className="p-4 md:p-6 space-y-8">
                {/* Show each location with its photos */}
                {selectedRegionLocations.map((location) => (
                  <div key={location.id} className="space-y-4">
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
                        {location.description && (
                          <p className="text-sm text-muted-foreground mt-2">{location.description}</p>
                        )}
                      </div>
                      {adminMode && (
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
                      )}
                    </div>

                    {/* Photos Grid */}
                    {location.photos && location.photos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {location.photos.map((photo, index) => (
                          <div 
                            key={index} 
                            className="group relative overflow-hidden rounded-xl aspect-video bg-muted cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxPhoto(photo);
                            }}
                          >
                            <img
                              src={photo}
                              alt={`${location.name} photo ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white text-xs md:text-sm">Click to view full size</p>
                              </div>
                            </div>
                          </div>
                        ))}
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

        {/* Selected Location Photo Gallery Modal */}
        {selectedLocation && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 animate-fade-in"
               onClick={() => setSelectedLocation(null)}>
            <div className="max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto bg-background rounded-xl md:rounded-2xl shadow-2xl"
                 onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b p-4 md:p-6 z-10">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent truncate">
                      {selectedLocation.name}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mt-1 flex items-center gap-2">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 text-red-500 flex-shrink-0" />
                      <span className="truncate">
                        {selectedLocation.state ? `${selectedLocation.state}, ` : ""}{selectedLocation.country}
                        {selectedLocation.date && ` • ${selectedLocation.date}`}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-1 md:gap-2 flex-shrink-0">
                    {/* Edit Button (Admin Mode) */}
                    {adminMode && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingLocation(selectedLocation);
                          setSelectedLocation(null);
                        }}
                        className="rounded-full hover:bg-primary/10 border-primary/50 h-8 w-8 md:h-10 md:w-10"
                        title="Edit location"
                      >
                        <Settings className="h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedLocation(null)}
                      className="rounded-full hover:bg-primary/10 h-8 w-8 md:h-10 md:w-10"
                    >
                      <X className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                </div>
                {selectedLocation.description && (
                  <p className="mt-4 text-muted-foreground">{selectedLocation.description}</p>
                )}
              </div>

              <div className="p-4 md:p-6">
                {/* Photo Gallery */}
                {selectedLocation.photos && selectedLocation.photos.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        <h4 className="font-semibold text-base md:text-lg">
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
                          className="gap-1 md:gap-2 text-xs md:text-sm"
                        >
                          <ImageIcon className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="hidden sm:inline">Manage</span>
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {selectedLocation.photos.map((photo, index) => (
                        <div 
                          key={index} 
                          className="group relative overflow-hidden rounded-xl aspect-video bg-muted cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxPhoto(photo);
                          }}
                        >
                          <img
                            src={photo}
                            alt={`${selectedLocation.name} photo ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <p className="text-white text-sm mb-2">Click to view full size</p>
                              {adminMode && (
                                <div className="flex gap-2 pointer-events-auto">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm(`Delete this photo?\n\n${photo}`)) {
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
                                    className="gap-1"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Delete
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-12 text-center">
                    <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-lg text-muted-foreground mb-2">No photos yet</p>
                    {adminMode ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingLocation(selectedLocation);
                          setSelectedLocation(null);
                        }}
                        className="mt-4"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Photos
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground/60">
                        Check back later for photos from this location!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Admin Location Editor Modal */}
        {editingLocation && adminMode && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
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
                        : 'Add a new place you\'ve visited'}
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

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editingLocation.description || ""}
                    onChange={(e) => setEditingLocation({ ...editingLocation, description: e.target.value })}
                    className="w-full px-4 py-2 bg-muted rounded-lg border-2 border-primary/20 focus:border-primary outline-none min-h-24"
                    placeholder="Share your experience at this location..."
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
                      (editingLocation.photos || []).map((photo, index) => (
                        <div key={index} className="flex gap-2 items-center bg-muted/50 rounded-lg p-2">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={photo}
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
                            value={photo}
                            onChange={(e) => {
                              const newPhotos = [...(editingLocation.photos || [])];
                              newPhotos[index] = e.target.value;
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
                      ))
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
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
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
