import { applyUITheme, updateToggleIcons } from "./utils/changetheme.js";
import { searchLocationCoordinates } from "./services/geocodingService.js";
import { applyMapTheme, changeMapView } from "./services/mapService.js";
import { mountGraphicTemperatureData } from "./services/temperatureGraphicService.js";
import {
    getLocationForecast,
    mountTodayForecast,
    mountWeekForecast,
    renderForecastWeather
} from "./services/forecastService.js";

/* ================= CONFIG ================= */

let LAT = -23.5475;
let LON = -46.63611;
let currentTheme = "light";


/* ================= FORECAST STATE ================= */
let TODAY_FORECAST = [];
let WEEK_FORECAST = [];
let ACTIVE_FORECAST = "today";


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

function changeTheme(event) {
    setTheme(event.currentTarget.checked ? "dark" : "light");
}

function getCurrentTime() {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    return `${hour}:00`;

}
function mountCurrentWeather(data) {
    let temperatureElement = document.getElementById("temperature");
    let weatherDescriptionElement = document.getElementById("weather_description");
    let windSpeedElement = document.getElementById("wind_speed");
    let uvIndexElement = document.getElementById("uv_index");
    let subtitleDate = document.getElementById("date");
    let chanceOfRainElement = document.getElementById("chance_of_rain");
    let currentTemperatureElement = document.getElementById("current_temperature");

    const currentTime = getCurrentTime();
    const currentWeather = data.find(entry => entry.time === currentTime);

    temperatureElement.textContent = currentWeather.temp + " C°";
    windSpeedElement.textContent = currentWeather.wind_speed + " KM/H";
    uvIndexElement.textContent = currentWeather.uv_index;
    chanceOfRainElement.textContent = currentWeather.rain + "%";
    currentTemperatureElement.textContent = currentWeather.feels_like + " C°";
    subtitleDate.textContent = currentWeather.time;



}

async function loadForecast(lat, lon) {
    try {
        const forecastData = await getLocationForecast(lat, lon);

        TODAY_FORECAST = mountTodayForecast(forecastData);
        mountCurrentWeather(TODAY_FORECAST);
        mountGraphicTemperatureData(TODAY_FORECAST);
        WEEK_FORECAST = mountWeekForecast(forecastData);

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


async function updateLocation({ lat, lon }) {
    if (!lat || !lon) return;
    LAT = lat;
    LON = lon;
    changeMapView(lat, lon)
    await loadForecast(LAT, LON);
}


searchLocationCoordinates(async ({ lat, lon }) => updateLocation({ lat, lon }));

async function initApp() {
    setTheme(currentTheme);
    getCurrentTime();
    await loadForecast(LAT, LON);
    searchLocationCoordinates(updateLocation);
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

document.getElementById("recenter").addEventListener("click", () => {
    changeMapView(LAT, LON);
});


initApp();
