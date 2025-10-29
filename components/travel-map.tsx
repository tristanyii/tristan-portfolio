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

// Your travel data - you can add more locations and photos here!
const travelData: TravelLocation[] = [
  {
    id: "1",
    name: "Durham",
    country: "USA",
    state: "North Carolina",
    visited: true,
    date: "2024-Present",
    description: "Home at Duke University - studying Computer Science and Statistics",
    coordinates: { lat: 35.9940, lng: -78.8986 },
    photos: ["/Headshot.jpg", "/MirrorPic.jpg"], // Add your Durham photos here
  },
  {
    id: "2",
    name: "Union",
    country: "USA",
    state: "South Carolina",
    visited: true,
    date: "Home",
    description: "My hometown where it all began",
    coordinates: { lat: 34.7154, lng: -81.6234 },
    photos: ["/GreatAunt.jpg"], // Add your Union photos here
  },
  {
    id: "3",
    name: "Charlotte",
    country: "USA",
    state: "North Carolina",
    visited: true,
    date: "2023-2024",
    description: "Frequent visits to the Queen City",
    coordinates: { lat: 35.2271, lng: -80.8431 },
    photos: ["/Carowinds.jpg"], // Add Charlotte photos
  },
  // Add more locations as you travel!
  // Template for new location:
  // {
  //   id: "4",
  //   name: "New York City",
  //   country: "USA",
  //   state: "New York",
  //   visited: true,
  //   date: "Summer 2024",
  //   description: "Amazing city experience!",
  //   coordinates: { lat: 40.7128, lng: -74.0060 },
  //   photos: ["/nyc1.jpg", "/nyc2.jpg"],
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
      <div className="h-full flex flex-col">
        {/* Compact Header */}
        <div className="px-4 py-4 border-b backdrop-blur-lg bg-background/50">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                My Travel Adventures ✈️
              </h2>
              <div className="flex gap-3 mt-1 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  📍 {visitedCount} Cities
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🌎 {visitedCountries} Countries
                </Badge>
                {visitedCountriesSet.has("USA") && (
                  <Badge variant="secondary" className="text-xs">
                    🗺️ {visitedStates.size} US States
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {/* View Mode Toggle */}
              <Button
                variant={viewMode === "world" ? "default" : "outline"}
                onClick={() => setViewMode("world")}
                size="sm"
                className="gap-1"
              >
                <Globe className="h-3 w-3" />
                World
              </Button>
              {visitedCountriesSet.has("USA") && (
                <Button
                  variant={viewMode === "usa" ? "default" : "outline"}
                  onClick={() => setViewMode("usa")}
                  size="sm"
                  className="gap-1"
                >
                  🇺🇸 USA
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-primary/10 h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* LARGE Interactive Map - Takes up most of the screen */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="text-center pt-4 pb-2 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-background/90 to-transparent">
              <p className="text-xs text-muted-foreground">
                {viewMode === "world" 
                  ? "🗺️ Click the red pins to see photos • Scroll to zoom • Drag to pan"
                  : "🗺️ Click the red pins to see photos • Scroll to zoom • Drag to pan"}
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
                    if (location) setSelectedLocation(location);
                  }}
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
                    if (location) setSelectedLocation(location);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Compact City List at Bottom */}
        <div className="border-t backdrop-blur-lg bg-background/80 p-4 max-h-40 overflow-y-auto">
          <div className="container mx-auto">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {travelData.map((location) => (
                <div
                  key={location.id}
                  className={`flex-shrink-0 px-4 py-2 rounded-full border-2 cursor-pointer transition-all ${
                    selectedLocation?.id === location.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background/50 border-primary/20 hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <MapPin className={`h-4 w-4 ${selectedLocation?.id === location.id ? "" : "text-red-500"}`} />
                    <span className="font-medium text-sm">{location.name}</span>
                    {location.photos && location.photos.length > 0 && (
                      <Camera className="h-3 w-3 opacity-70" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Location Photo Gallery Modal */}
        {selectedLocation && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
               onClick={() => setSelectedLocation(null)}>
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl"
                 onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b p-6 z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                      {selectedLocation.name}
                    </h3>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      {selectedLocation.state ? `${selectedLocation.state}, ` : ""}{selectedLocation.country}
                      {selectedLocation.date && ` • ${selectedLocation.date}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedLocation(null)}
                    className="rounded-full hover:bg-primary/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                {selectedLocation.description && (
                  <p className="mt-4 text-muted-foreground">{selectedLocation.description}</p>
                )}
              </div>

              <div className="p-6">
                {/* Photo Gallery */}
                {selectedLocation.photos && selectedLocation.photos.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Camera className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-lg">
                        Photos ({selectedLocation.photos.length})
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedLocation.photos.map((photo, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-xl aspect-video bg-muted">
                          <img
                            src={photo}
                            alt={`${selectedLocation.name} photo ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                            onClick={() => window.open(photo, '_blank')}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <p className="text-white text-sm">Click to view full size</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-12 text-center">
                    <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-lg text-muted-foreground mb-2">No photos yet</p>
                    <p className="text-sm text-muted-foreground/60">
                      Add photos to the location data in <code className="bg-muted px-2 py-1 rounded">travel-map.tsx</code>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
