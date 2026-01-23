import { weatherCodeToIcon } from "../mappings/weatherCodeToIcon.js";
import { formatDate, getCurrentTime,formatTime } from "../utils/dateTimeFormat.js";
import { getWeekForecast, getTodayForecast } from "../api/forecastApi.js";
import { applyUITheme } from "../utils/changetheme.js"


async function loadForecast(location) {
  const weekForecastData = await getWeekForecast(location);
  const todayForecastData = await getTodayForecast(location);
   showCurrentWeatherData();
  const todayForecast = mountTodayForecast(todayForecastData);
  const weekForecast = mountWeekForecast(weekForecastData);

  const timezone = todayForecastData.timezone;
  
  mountCurrentWeatherData(timezone, todayForecast);
  renderForecastWeather(todayForecast, "light");

  return {
    todayForecast,
    weekForecast
  };
}

function mountTodayForecast(data) {
  if (!data?.hourly?.time) return [];

  const {
    hourly,
    current
  } = data;

  return hourly.time.map((time, index) => ({
    time: formatTime(time),
    temp: Math.round(hourly.temperature_2m[index]),
    feels_like: current?.apparent_temperature
      ? Math.round(current.apparent_temperature)
      : null,
    weather_code: hourly.weather_code[index],
    rain: hourly.precipitation_probability[index],
    wind_speed: current?.wind_speed_10m ?? null,
    uv_index: hourly.uv_index[index] ?? null,
    current_temperature: current
      ? Math.round(current.temperature_2m)
      : null
  }));
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
      <img src="assets/icons/weather-icons/${weatherIcon}" alt="ícone de clima">
      <h3>${item.temp ?? "--"} °C</h3>
    `;

    container.appendChild(section);
  });

  applyUITheme(theme);
}

function mountCurrentWeatherData(timezone, data) {
  const temperatureElement = document.getElementById("temperature");
  const windSpeedElement = document.getElementById("wind_speed");
  const uvIndexElement = document.getElementById("uv_index");
  const chanceOfRainElement = document.getElementById("chance_of_rain");
  const currentTemperatureElement = document.getElementById("current_temperature");
  const subtitleDate = document.getElementById("date");
  const currentWeatherIcon = document.getElementById("weather-icon");

  const now = getCurrentTime(timezone);
  const roundedTime = formatTime(now);

  const currentWeather = data.find(
    entry => entry.time === roundedTime
  );

  if (!currentWeather) return;
  
  temperatureElement.textContent = `${currentWeather.temp} °C`;
  windSpeedElement.textContent = `${currentWeather.wind_speed} KM/H`;
  uvIndexElement.textContent = currentWeather.uv_index;
  chanceOfRainElement.textContent = `${currentWeather.rain}%`;
  currentTemperatureElement.textContent = `${currentWeather.feels_like} °C`;
  subtitleDate.textContent = now;
  currentWeatherIcon.src = `assets/icons/weather-icons/${weatherCodeToIcon[currentWeather.weather_code]}`;

}


function showCurrentWeatherData() {
  const container = document.querySelector(".selected-weather");

  container.innerHTML = `
    <div class="date">
      <p id="date"></p>
    </div>

    <div class="main-weather">
      <div class="weather-container">
        <div class="weather-info">
          <img src="assets/icons/wind.svg" alt="ícone de vento" onload="SVGInject(this)" />
          <p>Vento</p>
        </div>
        <h2 id="wind_speed"></h2>

        <div class="weather-info">
          <img src="assets/icons/thermometer.svg" alt="ícone de termometro" onload="SVGInject(this)" />
          <p>Sensação Térmica</p>
        </div>
        <h2 id="current_temperature"></h2>
      </div>

      <div class="weather">
        <img id="weather-icon" src="assets/icons/weather-icons/rain.svg" alt="chuva" />
        <div class="temperature">
          <h1 id="temperature"></h1>
          <p id="weather_description">Nublado</p>
        </div>
      </div>

      <div class="weather-container">
        <div class="weather-info">
          <img src="assets/icons/sun.svg" alt="ícone do sol" onload="SVGInject(this)" />
          <p>Raios UV</p>
        </div>
        <h2 id="uv_index"></h2>

        <div class="weather-info">
          <img src="assets/icons/cloud-rain.svg" alt="ícone de nuvem de chuva" onload="SVGInject(this)" />
          <p>Chance de Chuva</p>
        </div>
        <h2 id="chance_of_rain"></h2>
      </div>
    </div>
  `;
  
}



export {
  loadForecast,
  renderForecastWeather
};
