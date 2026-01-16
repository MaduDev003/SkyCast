import { applyUITheme, updateToggleIcons } from "./utils/Changetheme.js";
import { searchLocationCordinates } from './services/geocoding.js';

/* ================= CONFIG ================= */
const MAP_LIGHT_THEME = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
const MAP_DARK_THEME = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
const DEFAULT_POSITION = [-8.0578, -34.8829];
const DEFAULT_ZOOM = 10;

let currentTheme = "light";
let tileLayer;

/* ================= MAP ================= */
const map = L.map('map').setView(DEFAULT_POSITION, DEFAULT_ZOOM);

const worldBounds = L.latLngBounds(
    L.latLng(-90, -180),
    L.latLng(90, 180)
);
map.setMaxBounds(worldBounds);

function createTileLayer(url) {
    return L.tileLayer(url, {
        maxZoom: 19,
        minZoom: 3,
        noWrap: true,
        bounds: worldBounds,
        attribution: '&copy; OpenStreetMap, &copy; CARTO'
    });
}

function applyMapTheme(theme) {
    const url = theme === "dark" ? MAP_DARK_THEME : MAP_LIGHT_THEME;
    if (tileLayer) map.removeLayer(tileLayer);
    tileLayer = createTileLayer(url);
    tileLayer.addTo(map);
}

L.marker(DEFAULT_POSITION).addTo(map);

document.getElementById("recenter").addEventListener("click", () => {
    map.setView(DEFAULT_POSITION, DEFAULT_ZOOM);
});

/* ================= THEME ORCHESTRATOR ================= */
function setTheme(theme) {
    currentTheme = theme;

    applyUITheme(theme);
    applyMapTheme(theme);
    updateToggleIcons(theme === "dark");
}

function changeTheme(event) {
    const theme = event.currentTarget.checked ? "dark" : "light";
    setTheme(theme);
}


function graphicTemperature() {
    const labels = ['06h', '09h', '12h', '15h', '18h', '21h'];
    const data = {
        labels,
        datasets: [{
            label: 'Temperatura (°C)',
            data: [22, 25, 29, 30, 27, 24],
            borderColor: '#4FC3F7',
            tension: 0.2,
            pointRadius: 5
        }]
    };

    new Chart(document.getElementById('myChart'), {
        type: 'line',
        data,
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function selectForecast(event) {
  const option = event.target.closest('li');
  if (!option) return;

  document
    .querySelectorAll('.forecast ul li')
    .forEach(item => item.classList.remove('active'));

  option.classList.add('active');

 renderForecastData(option.dataset.type);

}

function renderForecastData(forecastType) {
    const container = document.getElementById('container-forecast');
    container.innerHTML = '';

    const data = forecastType === 'today'
        ? [
            { time: '15:00', temp: '22', icon: 'rain.svg' },
            { time: '18:00', temp: '21', icon: 'hail.svg' },
            { time: '21:00', temp: '20', icon: 'wind.svg' },
        ]
        : [
            { time: '12/03', temp: '22', icon: 'rain.svg' },
            { time: '14/03', temp: '21', icon: 'hail.svg' },
            { time: '15/03', temp: '20', icon: 'wind.svg' },
            { time: '16/03', temp: '20', icon: 'rain.svg' },
        ];

    data.forEach(item => {
        const section = document.createElement('section');
        section.classList.add('day-weather');
        section.innerHTML = `
            <p>${item.time}</p>
            <img src="assets/weather-icons/${item.icon}" alt="clima">
            <h3>${item.temp} °C</h3>
        `;
        container.appendChild(section);
    });
    applyUITheme(currentTheme);
}

searchLocationCordinates((lat, lon) => {
  console.log("Usuário escolheu:", lat, lon);
});

/* ================= INIT ================= */
document.getElementById("theme-switch").addEventListener("change", changeTheme);
document.querySelector('.forecast ul').addEventListener('click', selectForecast);
setTheme(currentTheme); 
graphicTemperature();
renderForecastData('today');




