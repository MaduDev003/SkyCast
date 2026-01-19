import { applyUITheme, updateToggleIcons } from "./utils/Changetheme.js";
import { searchLocationCordinates } from "./services/geocoding.js";
import {
    getLocationForecast,
    getTodayForecast,
    getWeekForecast,
    renderForecastWeather
} from "./services/forecast.js";

/* ================= CONFIG ================= */
const MAP_LIGHT_THEME =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";
const MAP_DARK_THEME =
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

let LAT = -23.5475;
let LON = -46.63611;
const DEFAULT_POSITION = [LAT, LON];
const DEFAULT_ZOOM = 10;

let currentTheme = "light";
let tileLayer;

/* ================= FORECAST STATE ================= */
let TODAY_FORECAST = [];
let WEEK_FORECAST = [];
let ACTIVE_FORECAST = "today";

/* ================= MAP ================= */
const map = L.map("map").setView(DEFAULT_POSITION, DEFAULT_ZOOM);

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
        attribution: "&copy; OpenStreetMap, &copy; CARTO"
    });
}

function applyMapTheme(theme) {
    const url = theme === "dark" ? MAP_DARK_THEME : MAP_LIGHT_THEME;
    if (tileLayer) map.removeLayer(tileLayer);
    tileLayer = createTileLayer(url);
    tileLayer.addTo(map);
}

/* ================= THEME ================= */
function setTheme(theme) {
    currentTheme = theme;
    applyUITheme(theme);
    applyMapTheme(theme);
    updateToggleIcons(theme === "dark");

    if (TODAY_FORECAST.length) {
        renderForecastWeather(
            ACTIVE_FORECAST === "today" ? TODAY_FORECAST : WEEK_FORECAST,
            currentTheme
        );
    }
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

function changeTheme(event) {
    setTheme(event.currentTarget.checked ? "dark" : "light");
}

function getCurrentTime() {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    return `${hour}:00`;

}
function showCurrentWeather(data){
    let temperatureElement = document.getElementById("temperature");
    let weatherDescriptionElement = document.getElementById("weather_description");
    let windSpeedElement = document.getElementById("wind_speed");
    let uvIndexElement = document.getElementById("uv_index");
    let subtitleDate = document.getElementById("date");
    let chanceOfRainElement = document.getElementById("chance_of_rain");
    let currentTemperatureElement = document.getElementById("current_temperature");

    const currentTime = getCurrentTime();
    const currentWeather = data.find(entry => entry.time === currentTime);

    temperatureElement.textContent  = currentWeather.temp + " C°";
    windSpeedElement.textContent  = currentWeather.wind_speed + " KM/H";
    uvIndexElement.textContent = currentWeather.uv_index;
    chanceOfRainElement.textContent = currentWeather.rain + "%";
    currentTemperatureElement.textContent = currentWeather.feels_like + " C°";
    subtitleDate.textContent = currentWeather.time;
   
    

}

async function loadForecast(lat, lon) {
  try {
    const forecastData = await getLocationForecast(lat, lon);

    TODAY_FORECAST = getTodayForecast(forecastData);
    showCurrentWeather(TODAY_FORECAST);
    console.log(TODAY_FORECAST)
    WEEK_FORECAST = getWeekForecast(forecastData);

    if (TODAY_FORECAST.length) {
      renderForecastWeather(
        ACTIVE_FORECAST === "today" ? TODAY_FORECAST : WEEK_FORECAST,
        currentTheme
      );
    }
  } catch (err) {
    console.error("Erro ao carregar forecast:", err);
  }
}



/* ================= INIT ================= */
async function initApp() {
  setTheme(currentTheme);
  graphicTemperature();
  getCurrentTime();

  await loadForecast(LAT, LON);
  try {
    const { lat, lon } = await searchLocationCordinates();
    if (!lat || !lon) return;
    LAT = lat;
    LON = lon;
    await loadForecast(LAT, LON);
     map.setView([lat, lon], DEFAULT_ZOOM);
  } catch {
    console.error("Erro ao obter localização.");
  }
}


document
    .getElementById("theme-switch")
    .addEventListener("change", changeTheme);

document
    .querySelector(".forecast ul")
    .addEventListener("click", event => {
        const option = event.target.closest("li");
        if (!option) return;

        document
            .querySelectorAll(".forecast ul li")
            .forEach(li => li.classList.remove("active"));

        option.classList.add("active");

        const type = option.dataset.type;
        if (type === ACTIVE_FORECAST) return;

        ACTIVE_FORECAST = type;

        renderForecastWeather(
            type === "today" ? TODAY_FORECAST : WEEK_FORECAST,
            currentTheme
        );
    });

initApp();
