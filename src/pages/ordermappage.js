import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function OrderMapPage() {
  const position = [28.6139, 77.2090];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh"
      }}
    >
      <MapContainer
        center={position}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      </MapContainer>
    </div>
  );
}