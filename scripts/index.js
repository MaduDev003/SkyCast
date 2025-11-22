const MAP_LIGHT_THEME = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
const MAP_DARK_THEME = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
const DEFAULT_POSITION = [-8.0578, -34.8829];
const DEFAULT_ZOOM = 10

let map = L.map('map').setView([51.505, -0.09], 13);

const southWest = L.latLng(-90, -180);
const northEast = L.latLng(90, 180);
const worldBounds = L.latLngBounds(southWest, northEast);

L.tileLayer(MAP_DARK_THEME, {
    maxZoom: 19,
    minZoom: 3,
    noWrap: true,
    bounds: worldBounds,
    attribution: '&copy; OpenStreetMap, &copy; CARTO'
}).addTo(map);

document.getElementById("recenter").addEventListener("click", () => {
    map.setView(DEFAULT_POSITION, DEFAULT_ZOOM);
});


map.setMaxBounds(worldBounds);

L.marker([-8.0578, -34.8829]).addTo(map)

function clearText() {
    const input = document.getElementById("search");
    const clearBtn = document.getElementById("clear-btn");

    clearBtn.addEventListener("click", () => {
        input.value = "";
        input.focus();
    });

}

function changeTheme(event) {
    const nonSelectedTheme = document.getElementById("non-selected");
    const selectedTheme = document.getElementById("selected-theme");

    const isDarkTheme = event.target.checked;


    if (isDarkTheme) {
        this._appTheme('dark');
        selectedTheme.src = "assets/icons/moon.svg";
        nonSelectedTheme.src = "assets/icons/sun.svg";

        selectedTheme.alt = "ícone da tela escura"
        nonSelectedTheme.alt = "ícone da tela clara"
    } else {
        this._appTheme('light');
        selectedTheme.src = "assets/icons/sun.svg";
        nonSelectedTheme.src = "assets/icons/moon.svg";

        selectedTheme.alt = "ícone da tela clara"
        nonSelectedTheme.alt = "ícone da tela escura"
    }
}

function _appTheme(choosedTheme) {
    const body = document.body;
    const weatherItems = document.querySelectorAll(".dashboard > div");
    const searchInput = document.querySelector('input[type="search"]');
    const locationIconPath = document.querySelector("header .location svg * ");
    const circleLocation = document.querySelector("header .location svg ");
    const span = document.querySelector("h3 span");
    const chossedTemperaturelegend = document.querySelector(".temperature p");
    const legends = document.querySelectorAll(".weather-info p");
    const weatherInfoIcons = document.querySelectorAll(".weather-info svg path");
    const weatherinfoSvg = document.querySelectorAll(".weather-info svg ");
    const temperature = document.querySelector(".temperature h1");
    const weatherDescription = document.querySelectorAll(".weather-container h2");
    const dateBox = document.querySelector(".date");
    const date = document.querySelector(".date p");
    const rootStyles = getComputedStyle(document.documentElement);

    const darkBG = rootStyles.getPropertyValue("--dark-background-color").trim();
    const darkBoxBG = rootStyles.getPropertyValue("--dark-box-background-color").trim();
    const fontForDark = rootStyles.getPropertyValue("--principal-dark-background-font-color").trim();
    const legendFontForDark = rootStyles.getPropertyValue("--legend-dark-background-font-color").trim();

    const lightBG = rootStyles.getPropertyValue("--light-background-color").trim();
    const lightBoxBG = rootStyles.getPropertyValue("--light-box-background-color").trim();
    const fontForLight = rootStyles.getPropertyValue("--principal-light-background-font-color").trim();
    const legendFontForLight = rootStyles.getPropertyValue("--legend-light-background-font-color").trim();



    if (choosedTheme === "dark") {
        body.style.backgroundColor = darkBG;
        locationIconPath.style.stroke = fontForDark;
        circleLocation.style.stroke = fontForDark;
        searchInput.style.backgroundColor = darkBoxBG;
        span.style.color = fontForDark;
        weatherItems.forEach(item => {
            item.style.backgroundColor = darkBoxBG;
        });
        temperature.style.color = fontForDark;
        chossedTemperaturelegend.style.color = legendFontForDark;
        legends.forEach(item => {
            item.style.color = legendFontForDark;
        });
        weatherInfoIcons.forEach(icon => {
            icon.style.color = legendFontForDark;
        });
        weatherinfoSvg.forEach(icon => {
            icon.style.color = legendFontForDark;
        });
        weatherDescription.forEach(item => {
            item.style.color = fontForDark;
        });
        date.style.color = legendFontForDark;

    } else {
        date.style.color = legendFontForLight;
        locationIconPath.style.stroke = darkBG;
        circleLocation.style.stroke = darkBG;
        body.style.backgroundColor = lightBG;
        searchInput.style.backgroundColor = lightBoxBG;
        span.style.color = darkBG;
        temperature.style.color = darkBoxBG;
        weatherItems.forEach(item => {
            item.style.backgroundColor = lightBoxBG;
        });
        chossedTemperaturelegend.style.color = legendFontForLight;
        legends.forEach(item => {
            item.style.color = legendFontForLight;
        });
        weatherInfoIcons.forEach(icon => {
            icon.style.color = legendFontForLight;
        });
        weatherinfoSvg.forEach(icon => {
            icon.style.color = legendFontForLight;
        });
        weatherDescription.forEach(item => {
            item.style.color = fontForLight;
        });
    }

}

