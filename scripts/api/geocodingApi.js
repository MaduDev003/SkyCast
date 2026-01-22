const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

async function getLocationData(locationName, limit = 5) {
  if (!locationName) return [];

  try {
    const params = new URLSearchParams({
      name: locationName,
      count: limit,
      language: "pt",
      format: "json"
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar localização");
    }

    const data = await response.json();
    return normalizeResults(data.results || []);
  } catch (error) {
    console.error("getLocationData error:", error);
    return [];
  }
}

function normalizeResults(results) {
  return results.map(item => ({
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,

    country: item.country,
    countryCode: item.country_code,

    state: item.admin1 || null,
    stateCode: item.admin1_code || null,

    timezone: item.timezone || null
  }));
}

export { getLocationData };
