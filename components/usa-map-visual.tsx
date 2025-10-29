"use client";

import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { useState } from "react";
import { MapPin, Camera } from "lucide-react";

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
  onMapClick?: (coordinates: { lat: number; lng: number }, countryName: string, stateName?: string) => void;
  adminMode?: boolean;
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

export function USAMapVisual({ visitedStates, onStateClick, cityMarkers = [], onMarkerClick, onMapClick, adminMode = false }: USAMapVisualProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const handleMapClick = (geography: any, projection: any, stateName: string) => (event: any) => {
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
      onMapClick({ lng: coords[0], lat: coords[1] }, "USA", stateName);
    }
  };

  return (
    <div className="w-full h-full bg-muted/20 rounded-lg border-2 border-primary/20 overflow-hidden relative touch-pinch-zoom" style={{ touchAction: 'manipulation' }}>
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 600,
        }}
        width={800}
        height={500}
        style={{ width: '100%', height: '100%', cursor: adminMode ? 'crosshair' : 'default' }}
      >
        <ZoomableGroup 
          center={[-96, 38]} 
          zoom={1}
          minZoom={0.5}
          maxZoom={8}
          filterZoomEvent={(evt) => {
            // Enable pinch zoom on touch devices
            return true;
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies, projection }) =>
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
                    onClick={(event) => {
                      if (adminMode && onMapClick) {
                        handleMapClick(geo, projection, stateName)(event);
                      } else if (isVisited) {
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
                        fill: adminMode ? "#ef4444" : isVisited ? "#059669" : "#4b5563",
                        stroke: "#8b5cf6",
                        strokeWidth: 2,
                        outline: "none",
                        cursor: adminMode ? "crosshair" : isVisited ? "pointer" : "default",
                      },
                      pressed: {
                        fill: adminMode ? "#dc2626" : isVisited ? "#047857" : "#4b5563",
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
          {cityMarkers.map((marker) => {
            const isHovered = hoveredMarker === marker.name;
            return (
              <Marker key={marker.name} coordinates={marker.coordinates}>
                <g
                  className="cursor-pointer"
                  onClick={() => onMarkerClick?.(marker.name)}
                  onMouseEnter={() => {
                    setHoveredState(null); // Clear state hover
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
      
      {/* Single Tooltip - Priority to markers over states */}
      {hoveredMarker ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-2xl z-[60] pointer-events-none border border-white/30 max-w-xs">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <MapPin className="h-4 w-4" />
            <span>{hoveredMarker}</span>
            <Camera className="h-3.5 w-3.5 text-yellow-300" />
          </div>
        </div>
      ) : hoveredState ? (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur px-4 py-2 rounded-lg border-2 border-primary/40 shadow-lg z-[50] pointer-events-none">
          <p className="text-sm font-semibold">{hoveredState}</p>
          <p className="text-xs text-muted-foreground">
            {visitedStates.has(hoveredState) ? "✓ Visited" : "🔒 Not visited yet"}
          </p>
        </div>
      ) : null}
    </div>
  );
}

