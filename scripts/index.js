import { applyUITheme, updateToggleIcons } from "./utils/changetheme.js";
import { searchLocationCoordinates } from "./services/geocodingService.js";
import { applyMapTheme, changeMapView } from "./services/mapService.js";
import {
  loadForecast,
  renderForecastWeather,
  renderCurrentWeather
} from "./services/forecastService.js";
import { mountGraphicTemperatureData } from "./services/temperatureGraphicService.js";

const state = {
  location: {
    lat: -23.5475,
    lon: -46.63611
  },
  theme: "light",
  forecast: {
    today: [],
    week: []
  },
  activeForecast: "today"
};

function setTheme(theme) {
  state.theme = theme;

  applyUITheme(theme);
  applyMapTheme(theme);
  updateToggleIcons(theme === "dark");

  if (state.forecast.today.length) {
    renderForecastWeather(
      state.activeForecast === "today"
        ? state.forecast.today
        : state.forecast.week,
      theme
    );
  }
}

function changeTheme(event) {
  setTheme(event.currentTarget.checked ? "dark" : "light");
}

async function updateLocation({ lat, lon }) {
  if (!lat || !lon) return;

  state.location.lat = lat;
  state.location.lon = lon;

  changeMapView(lat, lon);

  const { todayForecast, weekForecast } = await loadForecast(lat, lon);

  state.forecast.today = todayForecast;
  state.forecast.week = weekForecast;

  renderCurrentWeather(todayForecast);

  renderForecastWeather(
    state.activeForecast === "today" ? todayForecast : weekForecast,
    state.theme
  );

  mountGraphicTemperatureData(todayForecast);
}

async function initApp() {
  setTheme(state.theme);

  const { lat, lon } = state.location;
  const { todayForecast, weekForecast } = await loadForecast(lat, lon);

  state.forecast.today = todayForecast;
  state.forecast.week = weekForecast;

  renderCurrentWeather(todayForecast);
  renderForecastWeather(todayForecast, state.theme);
  mountGraphicTemperatureData(todayForecast);

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
    if (type === state.activeForecast) return;

    state.activeForecast = type;

    renderForecastWeather(
      type === "today"
        ? state.forecast.today
        : state.forecast.week,
      state.theme
    );
  });

document.getElementById("recenter").addEventListener("click", () => {
  const { lat, lon } = state.location;
  changeMapView(lat, lon);
});

initApp();
