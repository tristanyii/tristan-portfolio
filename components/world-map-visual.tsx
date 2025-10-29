"use client";

import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { useState } from "react";
import { MapPin, Camera } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CityMarker {
  name: string;
  coordinates: [number, number];
  hasPhotos: boolean;
}

interface WorldMapVisualProps {
  visitedCountries: Set<string>;
  onCountryClick: (countryName: string) => void;
  cityMarkers?: CityMarker[];
  onMarkerClick?: (cityName: string) => void;
  onMapClick?: (coordinates: { lat: number; lng: number }, countryName: string) => void;
  adminMode?: boolean;
}

// Map ISO codes to readable names
const countryNameMap: { [key: string]: string } = {
  "USA": "USA",
  "US": "USA",
  "840": "USA",
  "United States of America": "USA",
  "United States": "USA",
  "CAN": "Canada",
  "MEX": "Mexico",
  "BRA": "Brazil",
  "GBR": "UK",
  "FRA": "France",
  "DEU": "Germany",
  "ITA": "Italy",
  "ESP": "Spain",
  "JPN": "Japan",
  "CHN": "China",
  "KOR": "South Korea",
  "IND": "India",
  "AUS": "Australia",
  "NZL": "New Zealand",
  "ZAF": "South Africa",
};

export function WorldMapVisual({ visitedCountries, onCountryClick, cityMarkers = [], onMarkerClick, onMapClick, adminMode = false }: WorldMapVisualProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const handleMapClick = (geography: any, projection: any, countryName: string) => (event: any) => {
    if (!onMapClick || !adminMode) return;
    
    // Get the click coordinates relative to the SVG
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
    
    // Convert SVG coordinates to geographic coordinates
    const coords = projection.invert([svgPoint.x, svgPoint.y]);
    if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) {
      onMapClick({ lng: coords[0], lat: coords[1] }, countryName);
    }
  };

  return (
    <div className="w-full h-full bg-muted/20 rounded-lg border-2 border-primary/20 overflow-hidden touch-pinch-zoom" style={{ touchAction: 'manipulation' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 70,
        }}
        width={800}
        height={500}
        style={{ width: '100%', height: '100%', cursor: adminMode ? 'crosshair' : 'default' }}
      >
        <ZoomableGroup 
          center={[0, 0]} 
          zoom={1}
          minZoom={0.5}
          maxZoom={8}
          filterZoomEvent={(evt: any) => {
            // Enable pinch zoom on touch devices
            return true;
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies, projection }) =>
              geographies.map((geo) => {
                const isoCode = geo.id;
                const geoName = geo.properties.name;
                // Try multiple ways to match country name
                const countryName = countryNameMap[isoCode] || countryNameMap[geoName] || geoName;
                const isVisited = visitedCountries.has(countryName);
                const isHovered = hoveredCountry === countryName;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredCountry(countryName)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={(event) => {
                      if (adminMode && onMapClick) {
                        handleMapClick(geo, projection, countryName)(event);
                      } else if (isVisited) {
                        onCountryClick(countryName);
                      }
                    }}
                    style={{
                      default: {
                        fill: isVisited ? "#10b981" : "#6b7280",
                        stroke: "#1f2937",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: adminMode ? "#ef4444" : isVisited ? "#059669" : "#4b5563",
                        stroke: "#8b5cf6",
                        strokeWidth: 1.5,
                        outline: "none",
                        cursor: adminMode ? "crosshair" : isVisited ? "pointer" : "default",
                      },
                      pressed: {
                        fill: adminMode ? "#dc2626" : isVisited ? "#047857" : "#4b5563",
                        stroke: "#8b5cf6",
                        strokeWidth: 1.5,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* City Markers */}
          {cityMarkers.map((marker) => {
            const isHovered = hoveredMarker === marker.name;
            return (
              <Marker key={marker.name} coordinates={marker.coordinates}>
                <g
                  className="cursor-pointer"
                  onClick={() => onMarkerClick?.(marker.name)}
                  onMouseEnter={() => {
                    setHoveredCountry(null); // Clear country hover
                    setHoveredMarker(marker.name);
                  }}
                  onMouseLeave={() => setHoveredMarker(null)}
                  style={{
                    pointerEvents: 'all',
                  }}
                >
                  {/* Invisible hit area to prevent state hover interference */}
                  <circle r={15} fill="transparent" style={{ pointerEvents: 'all' }} />
                  
                  {/* Pin circle with pulse */}
                  <circle r={isHovered ? 6 : 4} fill={isHovered ? "#dc2626" : "#ef4444"} stroke="white" strokeWidth={2} />
                  <circle r={1.5} fill="white" />
                  {/* Pulse ring */}
                  <circle r={4} fill="none" stroke="#ef4444" strokeWidth={1} opacity={0.5}>
                    <animate attributeName="r" from="4" to="12" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Single Tooltip - Priority to markers over countries */}
      {hoveredMarker ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-2xl z-[60] pointer-events-none border border-white/30 max-w-xs">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <MapPin className="h-4 w-4" />
            <span>{hoveredMarker}</span>
            <Camera className="h-3.5 w-3.5 text-yellow-300" />
          </div>
        </div>
      ) : hoveredCountry ? (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur px-4 py-2 rounded-lg border-2 border-primary/40 shadow-lg z-[50] pointer-events-none">
          <p className="text-sm font-semibold">{hoveredCountry}</p>
          <p className="text-xs text-muted-foreground">
            {visitedCountries.has(hoveredCountry) ? "✓ Visited" : "🔒 Not visited yet"}
          </p>
        </div>
      ) : null}
    </div>
  );
}

