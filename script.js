let map = L.map('map').setView([51.505, -0.09], 13);

const southWest = L.latLng(-90, -180);
const northEast = L.latLng(90, 180);
const worldBounds = L.latLngBounds(southWest, northEast);

// ----------------------------------------------------
// ALTERAÇÃO AQUI: Trocando o provedor para CartoDB Positron
// ----------------------------------------------------
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    maxZoom: 19, 
    minZoom: 3,
    noWrap: true,
    bounds: worldBounds, 
    // Mantenha ou atualize a atribuição para incluir o provedor
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

map.setMaxBounds(worldBounds);

L.marker([-8.0578, -34.8829]).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();