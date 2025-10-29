"use client";

import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { useState } from "react";

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
}

// Map ISO codes to readable names
const countryNameMap: { [key: string]: string } = {
  "USA": "USA",
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

export function WorldMapVisual({ visitedCountries, onCountryClick, cityMarkers = [], onMarkerClick }: WorldMapVisualProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  return (
    <div className="w-full h-[500px] bg-muted/20 rounded-lg border-2 border-primary/20 overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 70,
        }}
        width={800}
        height={500}
      >
        <ZoomableGroup 
          center={[0, 0]} 
          zoom={1}
          minZoom={0.5}
          maxZoom={8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isoCode = geo.id;
                const countryName = countryNameMap[isoCode] || geo.properties.name;
                const isVisited = visitedCountries.has(countryName);
                const isHovered = hoveredCountry === countryName;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredCountry(countryName)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => {
                      if (isVisited) {
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
                        fill: isVisited ? "#059669" : "#4b5563",
                        stroke: "#8b5cf6",
                        strokeWidth: 1.5,
                        outline: "none",
                        cursor: isVisited ? "pointer" : "default",
                      },
                      pressed: {
                        fill: isVisited ? "#047857" : "#4b5563",
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
          {cityMarkers.map((marker) => (
            <Marker key={marker.name} coordinates={marker.coordinates}>
              <g
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => onMarkerClick?.(marker.name)}
                onMouseEnter={() => setHoveredMarker(marker.name)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                {/* Pin circle with pulse */}
                <circle r={4} fill="#ef4444" stroke="white" strokeWidth={2} />
                <circle r={1.5} fill="white" />
                {/* Pulse ring */}
                <circle r={4} fill="none" stroke="#ef4444" strokeWidth={1} opacity={0.5}>
                  <animate attributeName="r" from="4" to="12" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Hover Tooltip */}
      {hoveredCountry && !hoveredMarker && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur px-4 py-2 rounded-lg border-2 border-primary/40 shadow-lg animate-fade-in">
          <p className="text-sm font-semibold">{hoveredCountry}</p>
          <p className="text-xs text-muted-foreground">
            {visitedCountries.has(hoveredCountry) ? "✓ Visited" : "🔒 Not visited yet"}
          </p>
        </div>
      )}

      {/* Marker Tooltip */}
      {hoveredMarker && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl animate-fade-in">
          📍 {hoveredMarker}
          <span className="ml-2 text-yellow-300">📸 Click to view</span>
        </div>
      )}
    </div>
  );
}

