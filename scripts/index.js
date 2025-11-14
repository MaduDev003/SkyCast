let map = L.map('map').setView([51.505, -0.09], 13);

const southWest = L.latLng(-90, -180);
const northEast = L.latLng(90, 180);
const worldBounds = L.latLngBounds(southWest, northEast);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 3,
    noWrap: true,
    bounds: worldBounds,

    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

map.setMaxBounds(worldBounds);

L.marker([-8.0578, -34.8829]).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();


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


    const rootStyles = getComputedStyle(document.documentElement);

    const darkBG = rootStyles.getPropertyValue("--dark-background-color").trim();
    const darkBoxBG = rootStyles.getPropertyValue("--dark-box-background-color").trim();
    const fontForDark = rootStyles.getPropertyValue("--principal-dark-background-font-color").trim();

    const lightBG = rootStyles.getPropertyValue("--light-background-color").trim();
    const lightBoxBG = rootStyles.getPropertyValue("--light-box-background-color").trim();
    const fontForLight = rootStyles.getPropertyValue("--principal-light-background-font-color").trim();



    if (choosedTheme === "dark") {
        body.style.backgroundColor = darkBG;
        locationIconPath.style.stroke = lightBG;
        circleLocation.style.stroke = lightBG;
        searchInput.style.backgroundColor = darkBoxBG;
        span.style.color = fontForDark;
        weatherItems.forEach(item => {
            item.style.backgroundColor = darkBoxBG;
        });
 
    } else {
        locationIconPath.style.stroke = darkBG;
        circleLocation.style.stroke = darkBG;
        body.style.backgroundColor = lightBG;
        searchInput.style.backgroundColor = lightBoxBG;
        span.style.color = fontForLight;
        weatherItems.forEach(item => {
            item.style.backgroundColor = lightBoxBG;
        });
    }

}

