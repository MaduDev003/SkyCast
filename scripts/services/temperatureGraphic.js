let temperatureChart = null;


function graphicTemperature(hours, temperatures) {
    const ctx = document.getElementById('myChart');

    // Se já existir gráfico, destrói
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

export {
    graphicTemperature
};