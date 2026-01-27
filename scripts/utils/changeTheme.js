import { renderForecastWeather } from "../services/forecastService.js";
import { applyMapTheme } from "../services/mapService.js";


function getRootStyles(vars) {
    const root = getComputedStyle(document.documentElement);
    return {
        bg: root.getPropertyValue(vars.bg).trim(),
        box: root.getPropertyValue(vars.box).trim(),
        main: root.getPropertyValue(vars.main).trim(),
        legend: root.getPropertyValue(vars.legend).trim(),
    };
}

function darkThemeStyles() {
    return getRootStyles({
        bg: "--dark-background-color",
        box: "--dark-box-background-color",
        main: "--principal-dark-background-font-color",
        legend: "--legend-dark-background-font-color",
    });
}

function lightThemeStyles() {
    return getRootStyles({
        bg: "--light-background-color",
        box: "--light-box-background-color",
        main: "--principal-light-background-font-color",
        legend: "--legend-light-background-font-color",
    });
}

function getElements() {
    return {
        body: document.body,
        searchInput: document.querySelector('input[type="search"]'),

        locationPath: document.querySelector("header .location svg *"),
        locationCircle: document.querySelector("header .location svg"),
        locationState: document.querySelector("header .location h3"),
        spanCity: document.querySelector("h3 span"),

        temperature: document.querySelector(".temperature h1"),
        tempLegend: document.querySelector(".temperature p"),
        date: document.querySelector(".date p"),

        weatherItems: document.querySelectorAll(".dashboard > section"),
        legends: document.querySelectorAll(".weather-info p"),
        icons: document.querySelectorAll(".weather-info svg path"),
        iconsSvg: document.querySelectorAll(".weather-info svg"),
        descriptions: document.querySelectorAll(".weather-container h2"),

        forecastItems: document.querySelectorAll(".forecast ul li"),
        dayWeather: document.querySelectorAll(".day-weather"),
        weatherDescription: document.querySelectorAll(".day-weather p"),
        weatherTemperature: document.querySelectorAll(".day-weather h3"),

        suggestionsPlaces: document.querySelector(".suggestions"),
        loadingSpan: document.getElementById("loader-text")
    };
}



function applyUITheme(theme) {
    const styles = theme === "dark" ? darkThemeStyles() : lightThemeStyles();
    const el = getElements();

    if (el.body) el.body.style.backgroundColor = styles.bg;
    if (el.searchInput) {
        el.searchInput.style.backgroundColor = styles.box;
        el.searchInput.style.color = styles.main;
    }

    if (el.locationPath) el.locationPath.style.stroke = styles.main;
    if (el.locationCircle) el.locationCircle.style.stroke = styles.main;
    if (el.spanCity) el.spanCity.style.color = styles.main;
    if (el.locationState) el.locationState.style.color = styles.legend;

    if (el.temperature) el.temperature.style.color = styles.main;
    if (el.tempLegend) el.tempLegend.style.color = styles.legend;
    if (el.date) el.date.style.color = styles.legend;

    el.weatherItems.forEach(item => {
        if (item) item.style.backgroundColor = styles.box;
    });

    el.legends.forEach(p => {
        if (p) p.style.color = styles.legend;
    });

    el.icons.forEach(icon => {
        if (icon) icon.style.color = styles.legend;
    });

    el.iconsSvg.forEach(svg => {
        if (svg) svg.style.color = styles.legend;
    });

    el.descriptions.forEach(h2 => {
        if (h2) h2.style.color = styles.main;
    });


    el.dayWeather.forEach(card => {
        if (card) card.style.backgroundColor = styles.bg;
    });

    el.weatherDescription.forEach(p => {
        if (p) p.style.color = styles.legend;
    });

    el.weatherTemperature.forEach(h3 => {
        if (h3) h3.style.color = styles.main;
    });

    el.forecastItems.forEach(li => {
        if (li) li.style.color = styles.legend;
    });

    if (el.suggestionsPlaces) {
        el.suggestionsPlaces.style.backgroundColor = styles.box;
        el.suggestionsPlaces.classList.remove("light", "dark");
        el.suggestionsPlaces.classList.add(theme);
    }

    if (el.loadingSpan) {
        el.loadingSpan.style.color = styles.legend;
    }

}


function updateToggleIcons(isDark) {
    const selectedTheme = document.getElementById("selected-theme");
    if (!selectedTheme) return;

    selectedTheme.src = isDark
        ? "assets/icons/moon.svg"
        : "assets/icons/sun.svg";

    selectedTheme.alt = isDark
        ? "ícone da tela escura"
        : "ícone da tela clara";
}

function setTheme(theme, state) {
    state.theme = theme;

    applyUITheme(theme);
    applyMapTheme(theme);
    updateToggleIcons(theme === "dark");

    const forecastData =
        state.activeForecast === "today"
            ? state.forecast.today
            : state.forecast.week;

    if (forecastData?.length) {
        renderForecastWeather(forecastData, theme);
    }
}

export { setTheme, applyUITheme };
