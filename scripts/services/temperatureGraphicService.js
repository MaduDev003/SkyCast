import {removeLoading} from '../utils/loading.js';
let temperatureChart = null;


function renderGraphicTemperature(hours, temperatures) {
    const ctx = document.getElementById('myChart');

    if (temperatureChart) {
        temperatureChart.destroy();
    }

    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Temperatura (°C)',
                data: temperatures,
                borderColor: '#4FC3F7',
                tension: 0.2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function mountGraphicTemperatureData(todayForecast){
    removeLoading();
    const hours = [];
    const temperatures = [];
    for(const forecast of todayForecast){
        console.log(forecast)
        hours.push(forecast.time);
        temperatures.push(forecast.temp);
    }

    renderGraphicTemperature(hours, temperatures);
}

export {
    mountGraphicTemperatureData
};