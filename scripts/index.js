import { applyUITheme, updateToggleIcons } from "./utils/Changetheme.js";
import { searchLocationCordinates } from './services/geocoding.js';

/* ================= CONFIG ================= */
const MAP_LIGHT_THEME = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
const MAP_DARK_THEME = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
const DEFAULT_POSITION = [-8.0578, -34.8829];
const DEFAULT_ZOOM = 10;

let LAT;
let LON;

let currentTheme = "dark";
let tileLayer;

/* ================= FORECAST STATE ================= */
let TODAY_FORECAST = [];
let WEEK_FORECAST = [];
let ACTIVE_FORECAST = 'today';

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

/* ================= THEME ================= */
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

/* ================= GRAPH ================= */
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

/* ================= FORECAST API ================= */
async function getLocationForecast(lat, lon) {
  const url = `
    https://api.open-meteo.com/v1/forecast
    ?latitude=${lat}
    &longitude=${lon}
    &current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m
    &hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index
    &daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max,weather_code
    &timezone=auto
    &forecast_days=7
  `.replace(/\s+/g, '');

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar previsão do tempo");

  return res.json();
}

/* ================= DATA PARSERS ================= */
function getTodayForecast(data) {
  if (!data.hourly?.time) return [];

  const today = new Date().toISOString().slice(0, 10);
  const currentTemp = Math.round(data.current.temperature_2m);

  return data.hourly.time.reduce((acc, time, i) => {
    if (time.startsWith(today)) {
      acc.push({
        time: time.slice(11, 16),
        temp: Math.round(data.hourly.temperature_2m[i]),
        apparent_temp: Math.round(data.hourly.apparent_temperature[i]),
        weather_code: data.hourly.weather_code[i],
        rain: data.hourly.precipitation_probability[i],
        uv_index: data.hourly.uv_index[i],
        wind_speed: data.hourly.wind_speed_10m[i],
        current_temperature: currentTemp
      });
    }
    return acc;
  }, []);
}

function getWeekForecast(data) {
  return data.daily.time.map((day, i) => {
    const max = data.daily.temperature_2m_max[i];
    const min = data.daily.temperature_2m_min[i];

    return {
      date: day,
      temp: Math.round((max + min) / 2),
      weather_code: data.daily.weather_code[i],
      rain: data.daily.precipitation_probability_max[i],
      uv_index: data.daily.uv_index_max[i],
      wind_speed: data.daily.wind_speed_10m_max[i]
    };
  });
}

/* ================= WEATHER ICON ================= */
export function getWeatherIconByCode(code) {
  if (code === 0) return 'sunrise.svg';
  if ([1, 2, 3].includes(code)) return 'cloudy.svg';
  if ([45, 48].includes(code)) return 'smoke.svg';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rain.svg';
  if ([71, 73, 75, 85, 86].includes(code)) return 'snow.svg';
  if ([66, 67, 77].includes(code)) return 'hail.svg';
  if ([95, 96, 99].includes(code)) return 'thunderstorms.svg';
  return 'wind.svg';
}

/* ================= RENDER ================= */
function formatDate(date){
    const separeteDate = date.split('-');
    const year = separeteDate[0];
    const month = separeteDate[1];
    const day = separeteDate[2];
    return `${day}/${month}/${year}`;
}
function renderForecastWeather(data) {
  const container = document.getElementById('container-forecast');
  container.innerHTML = '';

  const isWeek = data[0]?.date !== undefined;

  data.forEach(item => {
    const section = document.createElement('section');
    section.classList.add('day-weather');

    section.innerHTML = `
      <p>${isWeek ? formatDate(item.date) : item.time}</p>
      <img src="assets/weather-icons/${getWeatherIconByCode(item.weather_code)}" alt="clima">
      <h3>${item.temp ?? '--'} °C</h3>
    `;

    container.appendChild(section);
  });

  applyUITheme(currentTheme);
}

/* ================= FORECAST TOGGLE ================= */
function selectForecast(event) {
  const option = event.target.closest('li');
  if (!option) return;

  document
    .querySelectorAll('.forecast ul li')
    .forEach(item => item.classList.remove('active'));

  option.classList.add('active');

  const type = option.dataset.type;
  if (type === ACTIVE_FORECAST) return;

  ACTIVE_FORECAST = type;

  if (type === 'today') {
    renderForecastWeather(TODAY_FORECAST);
  } else {
    renderForecastWeather(WEEK_FORECAST);
  }
}

/* ================= INIT ================= */
async function initApp() {
  setTheme(currentTheme);
  graphicTemperature();

  const { lat, lon } = await searchLocationCordinates();

  if (!lat || !lon) return;

  LAT = lat;
  LON = lon;

  const forecastData = await getLocationForecast(lat, lon);

  TODAY_FORECAST = getTodayForecast(forecastData);
  WEEK_FORECAST = getWeekForecast(forecastData);

  if (TODAY_FORECAST.length > 0) {
    renderForecastWeather(TODAY_FORECAST);
    ACTIVE_FORECAST = 'today';
  }

  map.setView([lat, lon], DEFAULT_ZOOM);
}

/* ================= EVENTS ================= */
document.getElementById("theme-switch")
  .addEventListener("change", changeTheme);

document.querySelector('.forecast ul')
  .addEventListener('click', selectForecast);

initApp();
