import { CONFIG } from "../config.js";

// Mapas gratuitos e confiáveis
const MAP_LIGHT_THEME =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const MAP_DARK_THEME =
  "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png";

const DEFAULT_ZOOM = CONFIG.DEFAULT_MAP_ZOOM;
const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));
const SUBDOMAINS = ["a", "b", "c", "d"];

let tileLayer;
let locationMarker;
let mapInstance;

function initMap() {
  const defaultLocation = [CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lon];

  // Cria mapa
  mapInstance = L.map("map", {
    center: defaultLocation,
    zoom: DEFAULT_ZOOM,
    maxBounds: worldBounds,
    minZoom: 3,
    maxZoom: 19,
  });

  // Marca a localização inicial
  locationMarker = L.marker(defaultLocation).addTo(mapInstance);

  // Tile padrão (claro)
  tileLayer = createTileLayer(MAP_LIGHT_THEME).addTo(mapInstance);

  // Configura botão centralizar
  const recenter = document.getElementById("recenter");
  if (recenter) {
    recenter.style.display = "block"; // garante que apareça
    recenter.addEventListener("click", () => {
      mapInstance.setView([CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lon], DEFAULT_ZOOM);
      locationMarker.setLatLng([CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lon]);
    });
  }

  return mapInstance;
}

function createTileLayer(url) {
  return L.tileLayer(url, {
    subdomains: SUBDOMAINS,
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

  // Aplica tema se passado
  if (theme) applyMapTheme(theme);

  // Garante que o botão de centralizar esteja visível
  const recenter = document.getElementById("recenter");
  if (recenter) recenter.style.display = "block";
}

// Inicializa o mapa assim que o módulo é importado
initMap();

export { updateMapView, applyMapTheme };
