"use client";

import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { useState } from "react";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface CityMarker {
  name: string;
  coordinates: [number, number];
  hasPhotos: boolean;
}

interface USAMapVisualProps {
  visitedStates: Set<string>;
  onStateClick: (stateName: string) => void;
  cityMarkers?: CityMarker[];
  onMarkerClick?: (cityName: string) => void;
}

// Map state names to their proper display names
const stateNames: { [key: string]: string } = {
  "01": "Alabama",
  "02": "Alaska",
  "04": "Arizona",
  "05": "Arkansas",
  "06": "California",
  "08": "Colorado",
  "09": "Connecticut",
  "10": "Delaware",
  "11": "District of Columbia",
  "12": "Florida",
  "13": "Georgia",
  "15": "Hawaii",
  "16": "Idaho",
  "17": "Illinois",
  "18": "Indiana",
  "19": "Iowa",
  "20": "Kansas",
  "21": "Kentucky",
  "22": "Louisiana",
  "23": "Maine",
  "24": "Maryland",
  "25": "Massachusetts",
  "26": "Michigan",
  "27": "Minnesota",
  "28": "Mississippi",
  "29": "Missouri",
  "30": "Montana",
  "31": "Nebraska",
  "32": "Nevada",
  "33": "New Hampshire",
  "34": "New Jersey",
  "35": "New Mexico",
  "36": "New York",
  "37": "North Carolina",
  "38": "North Dakota",
  "39": "Ohio",
  "40": "Oklahoma",
  "41": "Oregon",
  "42": "Pennsylvania",
  "44": "Rhode Island",
  "45": "South Carolina",
  "46": "South Dakota",
  "47": "Tennessee",
  "48": "Texas",
  "49": "Utah",
  "50": "Vermont",
  "51": "Virginia",
  "53": "Washington",
  "54": "West Virginia",
  "55": "Wisconsin",
  "56": "Wyoming",
};

export function USAMapVisual({ visitedStates, onStateClick, cityMarkers = [], onMarkerClick }: USAMapVisualProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  return (
    <div className="w-full h-[500px] bg-muted/20 rounded-lg border-2 border-primary/20 overflow-hidden relative">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 600,
        }}
        width={800}
        height={500}
      >
        <ZoomableGroup 
          center={[-96, 38]} 
          zoom={1}
          minZoom={0.5}
          maxZoom={8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateId = geo.id;
                const stateName = stateNames[stateId] || geo.properties.name;
                const isVisited = visitedStates.has(stateName);
                const isHovered = hoveredState === stateName;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredState(stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => {
                      if (isVisited) {
                        onStateClick(stateName);
                      }
                    }}
                    style={{
                      default: {
                        fill: isVisited ? "#10b981" : "#6b7280",
                        stroke: "#1f2937",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      hover: {
                        fill: isVisited ? "#059669" : "#4b5563",
                        stroke: "#8b5cf6",
                        strokeWidth: 2,
                        outline: "none",
                        cursor: isVisited ? "pointer" : "default",
                      },
                      pressed: {
                        fill: isVisited ? "#047857" : "#4b5563",
                        stroke: "#8b5cf6",
                        strokeWidth: 2,
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
      {hoveredState && !hoveredMarker && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur px-4 py-2 rounded-lg border-2 border-primary/40 shadow-lg animate-fade-in z-10">
          <p className="text-sm font-semibold">{hoveredState}</p>
          <p className="text-xs text-muted-foreground">
            {visitedStates.has(hoveredState) ? "✓ Visited" : "🔒 Not visited yet"}
          </p>
        </div>
      )}

      {/* Marker Tooltip */}
      {hoveredMarker && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl animate-fade-in z-20">
          📍 {hoveredMarker}
          <span className="ml-2 text-yellow-300">📸 Click to view</span>
        </div>
      )}
    </div>
  );
}

