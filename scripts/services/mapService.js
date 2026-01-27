import { CONFIG } from "../config.js";

const MAP_LIGHT_THEME =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const MAP_DARK_THEME =
  "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png";

const DEFAULT_ZOOM = CONFIG.DEFAULT_MAP_ZOOM;
const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

let tileLayer;
let locationMarker;
let mapInstance;

function initMap() {
  const defaultLocation = [CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lon];
  mapInstance = L.map("map", {
    center: defaultLocation,
    zoom: DEFAULT_ZOOM,
    maxBounds: worldBounds,
    minZoom: 3,
    maxZoom: 19,
  });

  locationMarker = L.marker(defaultLocation).addTo(mapInstance);
  tileLayer = createTileLayer(MAP_LIGHT_THEME).addTo(mapInstance);

  const recenter = document.getElementById("recenter");
  if (recenter) {
    recenter.style.display = "block";
    recenter.addEventListener("click", () => {
      mapInstance.setView([CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lon], DEFAULT_ZOOM);
      locationMarker.setLatLng([CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lon]);
    });
  }

  return mapInstance;
}

function createTileLayer(url) {
  return L.tileLayer(url, {
    maxZoom: 19,
    minZoom: 3,
    noWrap: true,
    bounds: worldBounds,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  });
}

function applyMapTheme(theme) {
  const url = theme === "dark" ? MAP_DARK_THEME : MAP_LIGHT_THEME;

  if (tileLayer && mapInstance) {
    mapInstance.removeLayer(tileLayer);
    tileLayer = createTileLayer(url).addTo(mapInstance);
  }

   const map = document.getElementById("map");


  if(url === MAP_DARK_THEME) map.classList.add("dark");
  else map.classList.remove("dark");
}

function updateMapView(location, theme) {
  if (!mapInstance) return;

  mapInstance.setView([location.lat, location.lon], DEFAULT_ZOOM);

  if (locationMarker) {
    locationMarker.setLatLng([location.lat, location.lon]);
  } else {
    locationMarker = L.marker([location.lat, location.lon]).addTo(mapInstance);
  }

  if (theme) applyMapTheme(theme);

  const recenter = document.getElementById("recenter");
  if (recenter) recenter.style.display = "block";
}

initMap();

export { updateMapView, applyMapTheme };
