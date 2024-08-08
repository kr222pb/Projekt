let previousLat, previousLng;

// Om platsen ändrats
function checkForLocationUpdate() {
    if (lat !== previousLat || lng !== previousLng) {
        previousLat = lat;
        previousLng = lng;
        fetchWeatherData(lat, lng); // Directly fetch weather data using current location
    }
}

//nya smhi api'n så att den skickar med lat long, istället för att jämföra med närmaste väderstation
async function fetchWeatherData(lat, lng) {
    const apiUrl = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lng}/lat/${lat}/data.json`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const weatherData = await response.json();

        const weatherInfo = extractWeatherInfo(weatherData);

        updateWeatherInfoText(weatherInfo.temperature);
        updateWeatherIcon(`bilder/${weatherInfo.weatherIcon}.svg`);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        updateWeatherInfoText("Ingen väderdata tillgänglig.");
    }
}

// Extract weather information from the SMHI API response
function extractWeatherInfo(weatherData) {
    // Extract the first timeSeries entry which contains the weather data
    const timeSeries = weatherData.timeSeries[0];

    // Get temperature and weather code from the parameters
    const temperature = timeSeries.parameters.find(param => param.name === "t").values[0];
    const weatherCode = timeSeries.parameters.find(param => param.name === "Wsymb2").values[0];

    // Get the weather description based on the SMHI weather codes
    const weatherIconPath = getWeatherDescription(weatherCode);

    return {
        temperature: `${temperature} °C`,
        weatherIcon: weatherIconPath
    };
}

// Vväderkoder från SMHI
const weatherDescriptions = {
    sunny: [1, 2, 3],
    cloudy: [4, 5, 6],
    rainy: [7, 8, 9],
    snowy: [10, 11, 12]
};

// Function to get weather description based on SMHI weather codes
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

// Update the weather information text on the page
function updateWeatherInfoText(infoText) {
    const weatherInfoElement = document.getElementById("weather-info");
    if (weatherInfoElement) {
        weatherInfoElement.textContent = infoText;
    } else {
        console.error("kan inte visa väder");
    }
}

// Update the weather icon on the page
function updateWeatherIcon(iconPath) {
    const weatherIconElement = document.getElementById("weather-icon");
    if (weatherIconElement) {
        weatherIconElement.src = iconPath;
    } else {
        console.error("fel med visningen utav väderikonen");
    }
}
