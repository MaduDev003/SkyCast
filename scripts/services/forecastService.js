import { weatherCodeToIcon } from "../mappings/weatherCodeToIcon.js";
import { formatDate, getCurrentTime } from "../utils/formatDate.js";
import { getLocationForecast } from "../api/forecastApi.js";
import { applyUITheme } from "../utils/changetheme.js";

/* ================= MOUNTERS ================= */

function mountTodayForecast(data) {
  if (!data.hourly?.time) return [];

  const today = new Date().toISOString().slice(0, 10);
  const currentTemp = Math.round(data.current.temperature_2m);

  return data.hourly.time.reduce((acc, time, i) => {
    if (time.startsWith(today)) {
      acc.push({
        time: time.slice(11, 16),
        temp: Math.round(data.hourly.temperature_2m[i]),
        feels_like: Math.round(data.hourly.apparent_temperature[i]),
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

function mountWeekForecast(data) {
  if (!data.daily?.time) return [];

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

/* ================= LOAD ================= */

async function loadForecast(lat, lon) {
  const forecastData = await getLocationForecast(lat, lon);

  const todayForecast = mountTodayForecast(forecastData);
  const weekForecast = mountWeekForecast(forecastData);

  return {
    todayForecast,
    weekForecast
  };
}

/* ================= RENDER ================= */

function renderForecastWeather(data, theme) {
  const container = document.getElementById("container-forecast");
  container.innerHTML = "";

  const isWeek = !!data[0]?.date;

  data.forEach(item => {
    const section = document.createElement("section");
    const weatherIcon = weatherCodeToIcon[item.weather_code] || "wind.svg";

    section.classList.add("day-weather");

    section.innerHTML = `
      <p>${isWeek ? formatDate(item.date) : item.time}</p>
      <img src="assets/weather-icons/${weatherIcon}" alt="clima">
      <h3>${item.temp ?? "--"} °C</h3>
    `;

    container.appendChild(section);
  });

  applyUITheme(theme);
}

function renderCurrentWeather(data) {
  const temperatureElement = document.getElementById("temperature");
  const windSpeedElement = document.getElementById("wind_speed");
  const uvIndexElement = document.getElementById("uv_index");
  const chanceOfRainElement = document.getElementById("chance_of_rain");
  const currentTemperatureElement = document.getElementById("current_temperature");
  const subtitleDate = document.getElementById("date");

  const currentTime = getCurrentTime();
  const currentWeather = data.find(entry => entry.time === currentTime);

  if (!currentWeather) return;

  temperatureElement.textContent = `${currentWeather.temp} C°`;
  windSpeedElement.textContent = `${currentWeather.wind_speed} KM/H`;
  uvIndexElement.textContent = currentWeather.uv_index;
  chanceOfRainElement.textContent = `${currentWeather.rain}%`;
  currentTemperatureElement.textContent = `${currentWeather.feels_like} C°`;
  subtitleDate.textContent = currentWeather.time;
}

/* ================= EXPORTS ================= */

export {
  loadForecast,
  renderForecastWeather,
  renderCurrentWeather
};
