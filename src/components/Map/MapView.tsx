"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Property } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  Available: "#22c55e",
  Sold: "#ef4444",
  Rented: "#f59e0b",
};

function MapFlyTo({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.flyTo([lat, lng], 13, { duration: 1, easeLinearity: 0.25 });
    }
  }, [lat, lng, map]);
  return null;
}

interface Props {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (p: Property) => void;
}

export default function MapView({ properties, selectedProperty, onSelectProperty }: Props) {
  return (
    <MapContainer
      center={[39.5, -98.35]}
      zoom={4}
      className="h-full w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapFlyTo
        lat={selectedProperty?.lat ?? null}
        lng={selectedProperty?.lng ?? null}
      />

      {properties.map((property) => {
        const isSelected = selectedProperty?.id === property.id;
        const fillColor = STATUS_COLORS[property.status] ?? "#3b82f6";

        return (
          <CircleMarker
            key={property.id}
            center={[property.lat, property.lng]}
            radius={isSelected ? 13 : 8}
            pathOptions={{
              color: isSelected ? "#ffffff" : fillColor,
              weight: isSelected ? 3 : 2,
              fillColor,
              fillOpacity: 1,
              opacity: 1,
            }}
            eventHandlers={{ click: () => onSelectProperty(property) }}
          >
            <Popup minWidth={200} maxWidth={260}>
              <div className="p-3">
                <div className="font-semibold text-sm text-slate-100 mb-1 leading-snug">
                  {property.address}
                </div>
                <div className="text-xs text-slate-400 mb-0.5">
                  Owner: {property.owner}
                </div>
                <div className="text-sm font-bold text-blue-400 mb-2">
                  ${property.price.toLocaleString()}/mo
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{
                      background:
                        property.status === "Available"
                          ? "#14532d"
                          : property.status === "Sold"
                          ? "#7f1d1d"
                          : "#78350f",
                      color:
                        property.status === "Available"
                          ? "#86efac"
                          : property.status === "Sold"
                          ? "#fca5a5"
                          : "#fcd34d",
                    }}
                  >
                    {property.status}
                  </span>
                  <span className="text-xs text-slate-500">{property.type}</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
