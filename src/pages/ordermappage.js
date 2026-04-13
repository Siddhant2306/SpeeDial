import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap
} from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/ordermappage.css";

import storeMarkerImg from "../assets/storeMarker.png";
import userMarkerImg from "../assets/locationMarker.png";
import riderMarkerImg from "../assets/deliveryboy.png";

const storeMarker = L.icon({
  iconUrl: storeMarkerImg,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -36],
  className: "store-marker"
});

const userMarker = L.icon({
  iconUrl: userMarkerImg,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -32],
  className: "user-marker"
});

const riderMarker = L.icon({
  iconUrl: riderMarkerImg,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -18],
  className: "rider-marker"
});

function FitRouteBounds({ routeCoords, storePosition, userPosition }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const points =
      routeCoords.length > 1 ? routeCoords : [storePosition, userPosition];

    const bounds = L.latLngBounds(points);

    map.fitBounds(bounds, {
      paddingTopLeft: [50, 80],
      paddingBottomRight: [50, 120],
      maxZoom: 15
    });
  }, [map, routeCoords, storePosition, userPosition]);

  return null;
}

function formatDistance(meters) {
  if (typeof meters !== "number") return "--";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds) {
  if (typeof seconds !== "number") return "--";
  const mins = Math.max(1, Math.round(seconds / 60));
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function getStatus(progress) {
  if (progress < 0.15) return "Order confirmed";
  if (progress < 0.35) return "Partner assigned";
  if (progress < 0.65) return "Pickup completed";
  if (progress < 0.9) return "Out for delivery";
  return "Arriving soon";
}

function getRemainingDuration(totalSeconds, progress) {
  if (typeof totalSeconds !== "number") return null;
  return Math.max(0, Math.round(totalSeconds * (1 - progress)));
}

function getPointAlongRoute(routeCoords, progress) {
  if (!routeCoords.length) return null;
  if (routeCoords.length === 1) return routeCoords[0];

  const index = Math.min(
    routeCoords.length - 1,
    Math.floor(progress * (routeCoords.length - 1))
  );

  return routeCoords[index];
}

export function OrderMapPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const userLat = location.state?.latitude || 28.6139;
  const userLng = location.state?.longitude || 77.2090;

  const userPosition = useMemo(() => [userLat, userLng], [userLat, userLng]);
  const storePosition = useMemo(() => [28.701254629548533, 77.42505686190981], []);

  const [routeCoords, setRouteCoords] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [routeLoading, setRouteLoading] = useState(true);
  const [routeError, setRouteError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadRoute() {
      setRouteLoading(true);
      setRouteError("");

      try {
        const start = `${storePosition[1]},${storePosition[0]}`;
        const end = `${userPosition[1]},${userPosition[0]}`;

        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`
        );

        if (!res.ok) {
          throw new Error(`Route request failed: ${res.status}`);
        }

        const data = await res.json();

        if (data.code !== "Ok" || !data.routes?.length) {
          throw new Error("No route found");
        }

        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        if (!cancelled) {
          setRouteCoords(coordinates);
          setRouteDistance(route.distance);
          setRouteDuration(route.duration);
          setRouteLoading(false);
        }
      } catch (err) {
        console.error("Route fetch failed:", err);
        if (!cancelled) {
          setRouteCoords([]);
          setRouteDistance(null);
          setRouteDuration(null);
          setRouteError("Live route unavailable");
          setRouteLoading(false);
        }
      }
    }

    loadRoute();

    return () => {
      cancelled = true;
    };
  }, [storePosition, userPosition]);

  useEffect(() => {
    if (routeCoords.length < 2) return;

    const id = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.0035;
        return next >= 1 ? 1 : next;
      });
    }, 120);

    return () => clearInterval(id);
  }, [routeCoords]);

  const riderPosition = getPointAlongRoute(routeCoords, progress);
  const deliveryStatus = getStatus(progress);
  const remainingTime = getRemainingDuration(routeDuration, progress);
  const hasRealRoute = routeCoords.length > 1;

  return (
    <div className="order-map-page">
      <div className="order-map-shell">
        <div className="order-map-header">
          <button className="map-back-btn" onClick={() => navigate(-1)}>
            ←
          </button>

          <div className="map-header-content">
            <div className="map-badge">Live Delivery Tracking</div>
            <h2>{deliveryStatus}</h2>
            <p>
              {routeLoading
                ? "Calculating the best route..."
                : routeError
                ? routeError
                : "Your order is moving toward your location"}
            </p>
          </div>

          <div className="map-header-pill">
            {routeLoading ? "Loading" : "Tracking"}
          </div>
        </div>

        <div className="order-map-body">
          <MapContainer
            center={userPosition}
            zoom={13}
            zoomControl={false}
            className="order-map-leaflet"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <FitRouteBounds
              routeCoords={routeCoords}
              storePosition={storePosition}
              userPosition={userPosition}
            />

            <Marker position={storePosition} icon={storeMarker}>
              <Popup>Speedial Store</Popup>
            </Marker>

            <Marker position={userPosition} icon={userMarker}>
              <Popup>Your Location</Popup>
            </Marker>

            {hasRealRoute && (
              <>
                <Polyline
                  positions={routeCoords}
                  pathOptions={{
                    color: "#22d3ee",
                    weight: 14,
                    opacity: 0.14,
                    lineCap: "round",
                    lineJoin: "round"
                  }}
                />
                <Polyline
                  positions={routeCoords}
                  pathOptions={{
                    color: "#22d3ee",
                    weight: 6,
                    opacity: 0.95,
                    lineCap: "round",
                    lineJoin: "round"
                  }}
                />
              </>
            )}

            {riderPosition && (
              <>
                <CircleMarker
                  center={riderPosition}
                  radius={18}
                  pathOptions={{
                    color: "#22d3ee",
                    fillColor: "#22d3ee",
                    fillOpacity: 0.15,
                    weight: 1
                  }}
                  className="rider-pulse-ring"
                />
                <Marker position={riderPosition} icon={riderMarker}>
                  <Popup>Delivery Partner</Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>

        <div className="order-map-footer">
          <div className="map-info-card highlight">
            <span className="label">Live Status</span>
            <span className="value">{deliveryStatus}</span>
          </div>

          <div className="map-info-card">
            <span className="label">Distance</span>
            <span className="value">{formatDistance(routeDistance)}</span>
          </div>

          <div className="map-info-card">
            <span className="label">ETA</span>
            <span className="value">{formatDuration(remainingTime)}</span>
          </div>

          <div className="map-info-card">
            <span className="label">Progress</span>
            <span className="value">{Math.round(progress * 100)}%</span>
          </div>
        </div>

        <div className="tracking-bottom-panel">
          <div className="tracking-panel-left">
            <div className="tracking-dot live"></div>
            <div>
              <div className="tracking-title">Partner is heading to you</div>
              <div className="tracking-subtitle">
                Real-time style preview for Speedial delivery tracking
              </div>
            </div>
          </div>

          <div className="tracking-route-points">
            <div className="tracking-point">
              <span className="point-marker store"></span>
              <span>Store</span>
            </div>
            <div className="tracking-line"></div>
            <div className="tracking-point">
              <span className="point-marker user"></span>
              <span>Destination</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}