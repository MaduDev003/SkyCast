export async function searchLocationCordinates() {
  return new Promise((resolve, reject) => {
    try {
      const input = document.getElementById("search");
      const container = document.getElementById("search-suggestions");
      const clearBtn = document.getElementById("clear-btn");

      if (!input || !container) {
        reject(new Error("Elementos de busca não encontrados"));
        return;
      }

      if (clearBtn) {
        clearBtn.addEventListener("click", () =>
          clearLocationInput(input, container)
        );
      }

      document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !container.contains(e.target)) {
          clearLocationInput(input, container);
        }
      });

      input.addEventListener("input", async () => {
        try {
          const value = input.value.trim();

          if (!value) {
            clearSuggestions(container);
            return;
          }

          const results = await getLocation(value);
          renderSuggestions(results, container, input, resolve);
        } catch (error) {
          reject(error);
        }
      });

      input.addEventListener("keydown", async (e) => {
        if (e.key !== "Enter") return;

        e.preventDefault();

        try {
          const value = input.value.trim();
          if (!value) return;

          const results = await getLocation(value, 1);

          if (results.length) {
            resolve({
              lat: results[0].latitude,
              lon: results[0].longitude
            });
          }

          clearSuggestions(container);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/* ================= API ================= */

async function getLocation(locationName, limit = 5) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${locationName}&count=${limit}&language=pt&format=json`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Erro ao buscar localização");
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("getLocation error:", error);
    return [];
  }
}

/* ================= HELPERS ================= */

function uniqueByCountry(results) {
  const map = new Map();

  results.forEach(item => {
    if (!item.country_code) return;

    if (!map.has(item.country_code)) {
      map.set(item.country_code, item);
    }
  });

  return [...map.values()];
}

function renderLocationItem(item, container, input, resolve) {
  if (!item.country_code) return;

  const flagUrl = `https://flagcdn.com/w20/${item.country_code.toLowerCase()}.png`;

  const div = document.createElement("div");
  div.classList.add("suggestion-item");

  div.innerHTML = `
    <div class="suggestion-info">
      <div>
        <img 
          src="${flagUrl}" 
          alt="Bandeira ${item.country_code}" 
          class="suggestion-flag"
        />
        <strong class="city">${item.name}</strong> 
        <p class="country"> - ${item.country}</p>
      </div>
    </div>
  `;

  div.addEventListener("click", () => {
    input.value = item.name;
    clearSuggestions(container);

    resolve({
      lat: item.latitude,
      lon: item.longitude
    });
  });

  container.appendChild(div);
}

function renderSuggestions(results, container, input, resolve) {
  container.innerHTML = "";

  const uniqueResults = uniqueByCountry(results);

  if (!uniqueResults.length) {
    container.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    container.style.display = "block";
    return;
  }

  uniqueResults.forEach(item =>
    renderLocationItem(item, container, input, resolve)
  );

  container.style.display = "block";
}

function clearLocationInput(input, container) {
  input.value = "";
  clearSuggestions(container);
  input.focus();
}

function clearSuggestions(container) {
  container.innerHTML = "";
  container.style.display = "none";
}
