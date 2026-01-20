const MAP_LIGHT_THEME =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";

const MAP_DARK_THEME =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

const DEFAULT_POSITION = [-23.5475, -46.63611];
const DEFAULT_ZOOM = 10;

const worldBounds = L.latLngBounds(
  L.latLng(-90, -180),
  L.latLng(90, 180)
);


let tileLayer;
let locationMarker;


function initMap() {
  const map = L.map("map").setView(DEFAULT_POSITION, DEFAULT_ZOOM);
  map.setMaxBounds(worldBounds);

  locationMarker = L.marker(DEFAULT_POSITION).addTo(map);

  return map;
}

const mapInstance = initMap();


function changeMapView(lat, lon, zoom = DEFAULT_ZOOM) {
  mapInstance.setView([lat, lon], zoom);
  locationMarker.setLatLng([lat, lon]);
}

function createTileLayer(url) {
  return L.tileLayer(url, {
    maxZoom: 19,
    minZoom: 3,
    noWrap: true,
    bounds: worldBounds,
    attribution: "&copy; OpenStreetMap, &copy; CARTO"
  });
}

function applyMapTheme(theme) {
  const url = theme === "dark" ? MAP_DARK_THEME : MAP_LIGHT_THEME;

  if (tileLayer) {
    mapInstance.removeLayer(tileLayer);
  }

  tileLayer = createTileLayer(url);
  tileLayer.addTo(mapInstance);
}

export {
  changeMapView,
  applyMapTheme
};
