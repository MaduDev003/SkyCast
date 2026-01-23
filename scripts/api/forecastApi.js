const BASE_URL = "https://api.open-meteo.com/v1/forecast";

async function getWeekForecast({lat, lon}) {
  const url = `${BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max,weather_code&timezone=auto&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar previsão do tempo");

  return await res.json();
}

async function getTodayForecast({ lat, lon }) {
 const url = `${BASE_URL}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m` +
    `&hourly=temperature_2m,precipitation_probability,weather_code,uv_index` +
    `&timezone=auto&forecast_days=1`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Erro ao buscar dados de hoje");
  return await res.json(); 
}


export {
  getTodayForecast,
  getWeekForecast
};