"use client"
import "leaflet/dist/leaflet.css"; // Import CSS của Leaflet
// components/Map.js
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Map() {
  return (
    <MapContainer
      center={[51.505, -0.09]} // Tọa độ trung tâm (ví dụ: London)
      zoom={13} // Mức zoom
      style={{ height: "500px", width: "100%" }} // Kích thước map
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}