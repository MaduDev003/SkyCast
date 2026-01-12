const MAP_LIGHT_THEME = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
const MAP_DARK_THEME = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
const DEFAULT_POSITION = [-8.0578, -34.8829];
const DEFAULT_ZOOM = 10;

let currentTheme = "light";
let tileLayer;


const map = L.map('map').setView(DEFAULT_POSITION, DEFAULT_ZOOM);

const worldBounds = L.latLngBounds(
    L.latLng(-90, -180),
    L.latLng(90, 180)
);

map.setMaxBounds(worldBounds);

function createTileLayer(url) {
    return L.tileLayer(url, {
        maxZoom: 19,
        minZoom: 3,
        noWrap: true,
        bounds: worldBounds,
        attribution: '&copy; OpenStreetMap, &copy; CARTO'
    });
}

function applyMapTheme(url) {
    if (tileLayer) map.removeLayer(tileLayer);
    tileLayer = createTileLayer(url);
    tileLayer.addTo(map);
}

applyMapTheme(MAP_LIGHT_THEME);

L.marker(DEFAULT_POSITION).addTo(map);


document.getElementById("recenter").addEventListener("click", () => {
    map.setView(DEFAULT_POSITION, DEFAULT_ZOOM);
});



function initClearButton() {
    const input = document.getElementById("search");
    const clearBtn = document.getElementById("clear-btn");

    clearBtn.addEventListener("click", () => {
        input.value = "";
        input.focus();
    });
}

function changeTheme(event) {
    const isDark = event.target.checked;

    currentTheme = isDark ? "dark" : "light";

    applyMapTheme(isDark ? MAP_DARK_THEME : MAP_LIGHT_THEME);
    applyUITheme(currentTheme);
    updateToggleIcons(isDark);
}

function updateToggleIcons(isDark) {
    const nonSelectedTheme = document.getElementById("non-selected");
    const selectedTheme = document.getElementById("selected-theme");

    if (isDark) {
        selectedTheme.src = "assets/icons/moon.svg";
        selectedTheme.alt = "ícone da tela escura";

        nonSelectedTheme.src = "assets/icons/sun.svg";
        nonSelectedTheme.alt = "ícone da tela clara";
    } else {
        selectedTheme.src = "assets/icons/sun.svg";
        selectedTheme.alt = "ícone da tela clara";

        nonSelectedTheme.src = "assets/icons/moon.svg";
        nonSelectedTheme.alt = "ícone da tela escura";
    }
}

function applyUITheme(theme) {
    const root = getComputedStyle(document.documentElement);

    const rootStyles = theme === "dark" ? {
        bg: root.getPropertyValue("--dark-background-color").trim(),
        box: root.getPropertyValue("--dark-box-background-color").trim(),
        main: root.getPropertyValue("--principal-dark-background-font-color").trim(),
        legend: root.getPropertyValue("--legend-dark-background-font-color").trim(),
    } : {
        bg: root.getPropertyValue("--light-background-color").trim(),
        box: root.getPropertyValue("--light-box-background-color").trim(),
        main: root.getPropertyValue("--principal-light-background-font-color").trim(),
        legend: root.getPropertyValue("--legend-light-background-font-color").trim(),
    };

    const elements = {
        body: document.body,
        searchInput: document.querySelector('input[type="search"]'),
        locationPath: document.querySelector("header .location svg *"),
        locationCircle: document.querySelector("header .location svg"),
        spanCity: document.querySelector("h3 span"),
        temperature: document.querySelector(".temperature h1"),
        tempLegend: document.querySelector(".temperature p"),
        weatherItems: document.querySelectorAll(".dashboard > div"),
        legends: document.querySelectorAll(".weather-info p"),
        icons: document.querySelectorAll(".weather-info svg path"),
        iconsSvg: document.querySelectorAll(".weather-info svg"),
        descriptions: document.querySelectorAll(".weather-container h2"),
        date: document.querySelector(".date p"),
    };

    elements.body.style.backgroundColor = rootStyles.bg;
    elements.searchInput.style.backgroundColor = rootStyles.box;

    elements.locationPath.style.stroke = rootStyles.main;
    elements.locationCircle.style.stroke = rootStyles.main;
    elements.spanCity.style.color = rootStyles.main;

    elements.temperature.style.color = rootStyles.main;
    elements.tempLegend.style.color = rootStyles.legend;

    elements.date.style.color = rootStyles.legend;

    elements.weatherItems.forEach(el => el.style.backgroundColor = rootStyles.box);
    elements.legends.forEach(el => el.style.color = rootStyles.legend);
    elements.icons.forEach(el => el.style.color = rootStyles.legend);
    elements.iconsSvg.forEach(el => el.style.color = rootStyles.legend);
    elements.descriptions.forEach(el => el.style.color = rootStyles.main);
}

function graphicTemperature() {
    const labels = ['06h', '09h', '12h', '15h', '18h', '21h'];

    const data = {
        labels: labels,
        datasets: [{
            label: 'Temperatura (°C)',
            data: [22, 25, 29, 30, 27, 24],
            pointHoverBorderColor: '#0e6892ff',
            pointHoverBackgroundColor: '#0e6892ff',
            fill: false,
            borderColor: '#4FC3F7',
            tension: 0.2,
            pointRadius: 5
        }]
    };


    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    suggestedMin: 20,
                    suggestedMax: 32
                }
            }
        }
    };

    new Chart(
        document.getElementById('myChart'),
        config
    );
}


graphicTemperature();
initClearButton();
