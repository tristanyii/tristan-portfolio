"use client";

import { useState } from "react";
import { X, MapPin, Camera, Plus, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorldMapVisual } from "./world-map-visual";
import { USAMapVisual } from "./usa-map-visual";

interface TravelLocation {
  id: string;
  name: string;
  country: string;
  state?: string; // For US locations
  visited: boolean;
  date?: string;
  description?: string;
  photos?: string[];
  coordinates: { lat: number; lng: number };
}

// Your travel data - you can add more locations here
const travelData: TravelLocation[] = [
  {
    id: "1",
    name: "Durham",
    country: "USA",
    state: "North Carolina",
    visited: true,
    date: "2024-Present",
    description: "Home at Duke University",
    coordinates: { lat: 35.9940, lng: -78.8986 },
  },
  {
    id: "2",
    name: "Union",
    country: "USA",
    state: "South Carolina",
    visited: true,
    date: "Home",
    description: "Hometown",
    coordinates: { lat: 34.7154, lng: -81.6234 },
  },
  // Add more locations as you travel!
  // Example for international:
  // {
  //   id: "3",
  //   name: "Tokyo",
  //   country: "Japan",
  //   visited: true,
  //   date: "Summer 2024",
  //   description: "Amazing cultural experience!",
  //   coordinates: { lat: 35.6762, lng: 139.6503 },
  // },
];

// US States that have been visited (derived from travelData)
const getVisitedUSStates = () => {
  const states = new Set<string>();
  travelData.forEach(location => {
    if (location.country === "USA" && location.state && location.visited) {
      states.add(location.state);
    }
  });
  return states;
};

// Countries that have been visited (derived from travelData)
const getVisitedCountries = () => {
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
  const [viewMode, setViewMode] = useState<"world" | "usa">("world");
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  if (!isOpen) return null;

  const visitedCount = travelData.filter(loc => loc.visited).length;
  const visitedCountries = [...new Set(travelData.filter(loc => loc.visited).map(loc => loc.country))].length;
  const visitedStates = getVisitedUSStates();
  const visitedCountriesSet = getVisitedCountries();

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

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg animate-fade-in">
      <div className="h-full overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                My Travel Adventures ✈️
              </h2>
              <div className="flex gap-4 mt-2 flex-wrap">
                <Badge variant="secondary" className="text-sm">
                  {visitedCount} Places Visited
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  {visitedCountries} Countries
                </Badge>
                {visitedCountriesSet.has("USA") && (
                  <Badge variant="secondary" className="text-sm">
                    {visitedStates.size} US States
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-primary/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-6 justify-center">
            <Button
              variant={viewMode === "world" ? "default" : "outline"}
              onClick={() => setViewMode("world")}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              World View
            </Button>
            {visitedCountriesSet.has("USA") && (
              <Button
                variant={viewMode === "usa" ? "default" : "outline"}
                onClick={() => setViewMode("usa")}
                className="gap-2"
              >
                🇺🇸 USA States
              </Button>
            )}
          </div>

          {/* Interactive Physical Map Visualization */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                {viewMode === "world" 
                  ? "🌍 Click green country for details • Scroll/Pinch to zoom • Drag to pan • Green = Visited • Gray = Not yet"
                  : "🗺️ Click green state for details • Scroll/Pinch to zoom • Drag to pan • Green = Visited • Gray = Not yet"}
              </p>
            </div>
            
            {viewMode === "world" ? (
              <WorldMapVisual 
                visitedCountries={visitedCountriesSet} 
                onCountryClick={(country) => handleRegionClick(country, false)}
              />
            ) : (
              <USAMapVisual 
                visitedStates={visitedStates} 
                onStateClick={(state) => handleRegionClick(state, true)}
              />
            )}
          </div>

          {/* Map Grid View */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {travelData.map((location) => (
              <Card
                key={location.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  location.visited
                    ? "bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20"
                    : "opacity-50 grayscale"
                } ${selectedLocation?.id === location.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedLocation(location)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-5 w-5 ${location.visited ? "text-green-500" : "text-muted-foreground"}`} />
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                    </div>
                    {location.visited && (
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-600">
                        Visited ✓
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{location.country}</p>
                    {location.date && (
                      <p className="text-xs text-muted-foreground">{location.date}</p>
                    )}
                    {location.description && (
                      <p className="text-sm mt-2">{location.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Location Card */}
            <Card className="border-dashed border-2 border-muted-foreground/20 hover:border-primary/50 cursor-pointer transition-all duration-300 hover:scale-105 flex items-center justify-center min-h-[200px]">
              <CardContent className="text-center">
                <Plus className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Add New Location</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Coming soon!</p>
              </CardContent>
            </Card>
          </div>

          {/* Selected Location Details */}
          {selectedLocation && (
            <Card className="glass border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedLocation.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">{selectedLocation.country}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLocation(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedLocation.date && (
                  <div>
                    <p className="text-sm font-semibold mb-1">When:</p>
                    <p className="text-muted-foreground">{selectedLocation.date}</p>
                  </div>
                )}
                
                {selectedLocation.description && (
                  <div>
                    <p className="text-sm font-semibold mb-1">About:</p>
                    <p className="text-muted-foreground">{selectedLocation.description}</p>
                  </div>
                )}

                {/* Photos Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Camera className="h-4 w-4" />
                    <p className="text-sm font-semibold">Photos</p>
                  </div>
                  {selectedLocation.photos && selectedLocation.photos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedLocation.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`${selectedLocation.name} photo ${index + 1}`}
                          className="rounded-lg object-cover w-full h-32 hover:scale-105 transition-transform cursor-pointer"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No photos yet</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Photos
                      </Button>
                    </div>
                  )}
                </div>

                {/* Coordinates */}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  📍 {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              💡 <strong>Tip:</strong> To add new locations and photos, edit the travel data in{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">components/travel-map.tsx</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

