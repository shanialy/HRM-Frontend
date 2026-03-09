"use client";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import * as L from "leaflet";

// 🟢 Office location
const OFFICE_LAT = 24.832279;
const OFFICE_LNG = 67.047424;

type Props = {
  latitude: number;
  longitude: number;
};

export default function OfficeMap({ latitude, longitude }: Props) {
  // 🟢 Correct position type for Leaflet
  const position: L.LatLngExpression = [latitude, longitude];

  // 🟢 Fix leaflet icon issue in Next.js
  const icon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer
      center={position}
      zoom={16}
      style={{ height: "300px", width: "100%" }}
    >
      {/* 🗺 Map tiles */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 📍 Employee location */}
      <Marker position={position} icon={icon} />

      {/* 🏢 Office marker */}
      <Marker position={[OFFICE_LAT, OFFICE_LNG]} icon={icon} />

      {/* 🟢 500m radius circle */}
      <Circle
        center={[OFFICE_LAT, OFFICE_LNG]}
        radius={500}
        pathOptions={{ color: "green" }}
      />
    </MapContainer>
  );
}