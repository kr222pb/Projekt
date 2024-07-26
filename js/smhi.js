let previousLat, previousLng;

// Om platsen ändrats
function checkForLocationUpdate() {
    if (lat !== previousLat || lng !== previousLng) {
        previousLat = lat;
        previousLng = lng;
        findNearestWeatherStation(lat, lng);
    }
}

async function fetchWeatherData() {
    const temperatureUrl = 'https://opendata-download-metobs.smhi.se/api/version/latest/parameter/1/station-set/all/period/latest-hour/data.json';
    const weatherUrl = 'https://opendata-download-metobs.smhi.se/api/version/latest/parameter/13/station-set/all/period/latest-hour/data.json';

    try {
        const [tempResponse, weatherResponse] = await Promise.all([
            fetch(temperatureUrl),
            fetch(weatherUrl)
        ]);

        if (!tempResponse.ok || !weatherResponse.ok) {
            throw new Error(`HTTP error! Status: ${tempResponse.status} or ${weatherResponse.status}`);
        }

        const [temperatureData, weatherData] = await Promise.all([
            tempResponse.json(),
            weatherResponse.json()
        ]);

        return { temperatureData, weatherData };
    } catch (error) {
        return null;
    }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function findNearestStation(weatherData, lat, lng) {
    let nearestStation = null;
    let minDistance = Infinity;
    weatherData.station.forEach(station => {
        const distance = getDistanceFromLatLonInKm(lat, lng, station.latitude, station.longitude);
        if (distance < minDistance && station.value && station.value.length > 0) {
            minDistance = distance;
            nearestStation = station;
        }
    });
    return nearestStation;
}

async function findNearestWeatherStation(lat, lng) {
    const allWeatherData = await fetchWeatherData();
    if (!allWeatherData) {
        updateWeatherInfoText("Ingen väderdata tillgänglig.");
        return;
    }

    let nearestTempStation = findNearestStation(allWeatherData.temperatureData, lat, lng);
    let nearestWeatherStation = findNearestStation(allWeatherData.weatherData, lat, lng);

    if (nearestTempStation && nearestWeatherStation) {
        const temperature = nearestTempStation.value[0] ? `${nearestTempStation.value[0].value} °C` : "Temperaturdata saknas";
        const weatherIconPath = getWeatherDescription(parseInt(nearestWeatherStation.value[0].value));
        updateWeatherInfoText(temperature);  //uppdatera temperaturtext
        updateWeatherIcon(`bilder/${weatherIconPath}.svg`);  // Uppdaterar ikonen
    } else {
        updateWeatherInfoText("Inga närliggande väderstationer hittades.");
    }
}

// Väderkoder från smhi
const weatherDescriptions = {
    sunny: [0, 1, 2, 3, 5, 10, 104, 105],
    cloudy: [11, 12, 13, 14, 15, 16, 17, 30, 31, 32, 33, 34, 35, 110],
    rainy: [20, 21, 22, 23, 24, 25, 26, 27, 60, 61, 62, 63, 64, 65, 66, 80, 81, 82, 123, 161, 163],
    snowy: [70, 71, 72, 73, 74, 75, 85, 86, 87, 88, 89]
};

function getWeatherDescription(code) {
    if (code === null) {
        return "default";
    } else if (weatherDescriptions.sunny.includes(code)) {
        return "sol";
    } else if (weatherDescriptions.cloudy.includes(code)) {
        return "moln";
    } else if (weatherDescriptions.rainy.includes(code)) {
        return "regn";
    } else if (weatherDescriptions.snowy.includes(code)) {
        return "sno";
    } else {
        return "default";
    }
}

function updateWeatherInfoText(infoText) {
    const weatherInfoElement = document.getElementById("weather-info");
    if (weatherInfoElement) {
        weatherInfoElement.textContent = infoText;
    } else {
        console.error("kan inte visa väder");
    }
}

function updateWeatherIcon(iconPath) {
    const weatherIconElement = document.getElementById("weather-icon");
    if (weatherIconElement) {
        weatherIconElement.src = iconPath;
    } else {
        console.error("fel med visningen utav väderikonen");
    }
}

