import { CONFIG } from "./config.js";
import { searchLocationCoordinates } from "./services/geocodingService.js";
import { updateMapView } from "./services/mapService.js";
import { setTheme } from "./utils/changetheme.js";
import {
  loadForecast,
  renderForecastWeather,
  renderCurrentWeather
} from "./services/forecastService.js";
import { mountGraphicTemperatureData } from "./services/temperatureGraphicService.js";

const state = {
  location: {
    lat: CONFIG.DEFAULT_LOCATION.lat,
    lon: CONFIG.DEFAULT_LOCATION.lon
  },
  theme: CONFIG.DEFAULT_THEME,
  forecast: {
    today: [],
    week: []
  },
  activeForecast: "today"
};

function getActiveForecast() {
  return state.activeForecast === "today"
    ? state.forecast.today
    : state.forecast.week;
}

function changeTheme(event) {
  const theme = event.currentTarget.checked ? "dark" : "light";
  setTheme(theme, state);

  updateMapView(state.location, theme);
}

function handleForecastClick(event) {
  const option = event.target.closest("li");
  if (!option) return;

  document.querySelectorAll(".forecast ul li").forEach(li => li.classList.remove("active"));
  option.classList.add("active");

  const type = option.dataset.type;
  if (type === state.activeForecast) return;

  state.activeForecast = type;
  renderForecastWeather(getActiveForecast(), state.theme);
}

function handleRecenterClick() {
  updateMapView(state.location, state.theme);
}

async function updateLocation({ lat, lon }) {
  if (!lat || !lon) return;

  state.location.lat = lat;
  state.location.lon = lon;

  updateMapView(state.location, state.theme);

  const { todayForecast, weekForecast } = await loadForecast(lat, lon);

  state.forecast.today = todayForecast;
  state.forecast.week = weekForecast;

  renderCurrentWeather(todayForecast);
  renderForecastWeather(getActiveForecast(), state.theme);
  mountGraphicTemperatureData(todayForecast);
}

async function initApp() {
  setTheme(state.theme, state);

  const { lat, lon } = state.location;
  const { todayForecast, weekForecast } = await loadForecast(lat, lon);

  state.forecast.today = todayForecast;
  state.forecast.week = weekForecast;

  renderCurrentWeather(todayForecast);
  renderForecastWeather(getActiveForecast(), state.theme);
  mountGraphicTemperatureData(todayForecast);

  searchLocationCoordinates(updateLocation);
}

document.getElementById("theme-switch").addEventListener("change", changeTheme);
document.querySelector(".forecast ul").addEventListener("click", handleForecastClick);
document.getElementById("recenter").addEventListener("click", handleRecenterClick);

initApp();
