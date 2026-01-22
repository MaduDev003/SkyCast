import { getLocationData } from "../api/geocodingApi.js";

export function searchLocationCoordinates(onSelect) {
  const elements = getSearchElements();

  bindClearButton(elements);
  bindOutsideClick(elements);
  bindInputSearch(elements, onSelect);
  bindEnterKey(elements, onSelect);
}


function getSearchElements() {
  const input = document.getElementById("search");
  const container = document.getElementById("search-suggestions");
  const clearBtn = document.getElementById("clear-btn");

  if (!input || !container) {
    throw new Error("Elementos de busca não encontrados");
  }

  return { input, container, clearBtn };
}


function bindClearButton({ clearBtn, input, container }) {
  if (!clearBtn) return;

  clearBtn.addEventListener("click", () =>
    clearLocationInput(input, container)
  );
}

function bindOutsideClick({ input, container }) {
  document.addEventListener("click", (event) => {
    if (!input.contains(event.target) && !container.contains(event.target)) {
      clearLocationInput(input, container);
    }
  });
}

function bindInputSearch({ input, container }, onSelect) {
  input.addEventListener("input", async () => {
    const locationName = input.value.trim();

    if (!locationName) {
      clearSuggestions(container);
      return;
    }

    const results = await getLocationData(locationName);
    renderSuggestions(results, container, input, onSelect);
  });
}

function bindEnterKey({ input, container }, onSelect) {
  input.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    const locationName = input.value.trim();
    if (!locationName) return;

    const results = await getLocationData(locationName, 1);

    if (results.length) {
      clearSuggestions(container);
      updateLocationHeader(results[0]);
      onSelect({
        lat: results[0].latitude,
        lon: results[0].longitude
      });
    }
  });
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

function renderLocationItem(item, container, input, onSelect) {
  if (!item.country_code) return;

  const flagUrl = `https://flagcdn.com/w20/${item.country_code.toLowerCase()}.png`;

  const div = document.createElement("div");
  div.classList.add("suggestion-item");

  div.innerHTML = `
    <div class="suggestion-info">
      <img 
        src="${flagUrl}" 
        alt="Bandeira ${item.country}" 
        class="suggestion-flag"
      />
      <strong class="city">${item.name}</strong>
      <span class="country"> - ${item.country}</span>
    </div>
  `;


  div.addEventListener("click", () => {
    input.value = item.name;
    clearSuggestions(container);
    updateLocationHeader(item)
    onSelect({
      lat: item.latitude,
      lon: item.longitude
    });
  });

  container.appendChild(div);
}

function getStateAbbreviation(stateName) {
  if (!stateName) return "";

  const words = stateName.trim().split(/\s+/); 
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  } else {
    return words.map(w => w[0].toUpperCase()).join("");
  }
}

async function updateLocationHeader(location) {
  if (!location || !location.name) return; 
  const city = location.name;
  const stateAbbr = getStateAbbreviation(location.admin1);
  console.log(city, stateAbbr);

  const h3 = document.querySelector(".location h3");
  h3.innerHTML = `<span>${city},</span> ${stateAbbr}`; 
}

function uniqueByCountry(results) {
  const map = new Map();

  results.forEach(item => {
    if (item.country_code && !map.has(item.country_code)) {
      map.set(item.country_code, item);
    }
  });

  return [...map.values()];
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
