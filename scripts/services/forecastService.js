import { applyUITheme } from "../utils/changetheme.js";
import { weatherCodeToIcon } from "../mappings/weatherCodeToIcon.js";
import { formatDate } from "../utils/formatDate.js";

async function getLocationForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max,weather_code&timezone=auto&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar previsão do tempo");

  return res.json();
}

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



export {
  getLocationForecast,
  mountTodayForecast,
  mountWeekForecast,
  renderForecastWeather
};
