async function fetchTemperature() {
    const url = 'https://opendata-download-metobs.smhi.se/api/version/latest/parameter/1/station-set/all/period/latest-hour/data.json';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Received weather data:", data);
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function processWeatherData(weatherData) {
    console.log("Data updated at:", new Date(weatherData.updated));

    if (weatherData.station && weatherData.station.length > 0) {
        weatherData.station.forEach((station) => {
            console.log(`Station: ${station.name}`);
            console.log(`Location: Lat ${station.latitude}, Lng ${station.longitude}`);
            if (station.value && station.value.length > 0) {
                console.log(`Temperature: ${station.value[0].value} °C`); // Assumerar att 'value' finns och är temperaturdata
            }
        });
    } else {
        console.log("No station data available");
    }
}

fetchTemperature().then(processWeatherData);




