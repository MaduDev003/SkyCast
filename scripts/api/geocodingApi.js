async function getLocationData(locationName, limit = 5) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      locationName
    )}&count=${limit}&language=pt&format=json`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao buscar localização");

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("searchLocation error:", error);
    return [];
  }
}

export {
    getLocationData
}