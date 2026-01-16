/**
 * @param {Function} onSelect
 */
export function searchLocationCordinates(onSelect) {
  const input = document.getElementById("search");
  const container = document.getElementById("search-suggestions");
  const clearBtn = document.getElementById("clear-btn");

  if (!input || !container) return;


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
    const value = input.value.trim();

    if (!value) {
      clearSuggestions(container);
      return;
    }

    const results = await getLocation(value);
    renderSuggestions(results, container, input, onSelect);
  });

  input.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    const results = await getLocation(value, 1);

    if (results.length && onSelect) {
      onSelect(results[0].latitude, results[0].longitude);
    }

    clearSuggestions(container);
  });
}


async function getLocation(locationName, limit = 5) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${locationName}&count=${limit}&language=pt&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
}


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

function renderLocationItem(item, container, input, onSelect) {
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
    if (onSelect) onSelect(item.latitude, item.longitude);
  });

  container.appendChild(div);
}

function renderSuggestions(results, container, input, onSelect) {
  container.innerHTML = "";

  const uniqueResults = uniqueByCountry(results);

  if (!uniqueResults.length) {
    container.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    container.style.display = "block";
    return;
  }

  uniqueResults.forEach(item =>
    renderLocationItem(item, container, input, onSelect)
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
