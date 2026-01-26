import { CONFIG } from "../config.js";

const MAP_LIGHT_THEME =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";

const MAP_DARK_THEME = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const DEFAULT_ZOOM = CONFIG.DEFAULT_MAP_ZOOM;
const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

let tileLayer;
let locationMarker;
let mapInstance;

function initMap() {
  const defaultLocation = [CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lon];

  mapInstance = L.map("map").setView(defaultLocation, DEFAULT_ZOOM);
  mapInstance.setMaxBounds(worldBounds);

  locationMarker = L.marker(defaultLocation).addTo(mapInstance);

  tileLayer = createTileLayer(MAP_LIGHT_THEME).addTo(mapInstance);

  return mapInstance;
}

function createTileLayer(url) {
  return L.tileLayer(url, {
    maxZoom: 19,
    minZoom: 3,
    noWrap: true,
    bounds: worldBounds,
    detectRetina: false,
    attribution: "&copy; OpenStreetMap, &copy; CARTO"
  });
}

function applyMapTheme(theme) {
  const url = theme === "dark" ? MAP_DARK_THEME : MAP_LIGHT_THEME;

  if (tileLayer) mapInstance.removeLayer(tileLayer);

  tileLayer = createTileLayer(url).addTo(mapInstance);
}

function updateMapView(location, theme) {
  mapInstance.setView([location.lat, location.lon], DEFAULT_ZOOM);
  locationMarker.setLatLng([location.lat, location.lon]);
  if (theme) applyMapTheme(theme);
}

initMap();

export { updateMapView, applyMapTheme };
