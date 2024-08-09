let previousLat, previousLng;

// Om platsen ändrats
function checkForLocationUpdate() {
    if (lat !== previousLat || lng !== previousLng) {
        previousLat = lat;
        previousLng = lng;
        fetchWeatherData(lat, lng); //Hämtar väderdata om lat long har bytts
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

//Tar ut väderdatan från SMHIs svar
function extractWeatherInfo(weatherData) {

    const timeSeries = weatherData.timeSeries[0];

    // hämtar temperaturen och väderkoderna
    const temperature = timeSeries.parameters.find(param => param.name === "t").values[0];
    const weatherCode = timeSeries.parameters.find(param => param.name === "Wsymb2").values[0];

    
    const weatherIconPath = getWeatherDescription(weatherCode);

    return {
        temperature: `${temperature} °C`,
        weatherIcon: weatherIconPath
    };
}

// Vväderkoder från SMHI, används för att ge rätt bild
const weatherDescriptions = {
    sunny: [1, 2], 
    cloudy: [3, 4, 5, 6, 7],
    rainy: [8, 9, 10, 18, 19, 20], 
    snowy: [12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 26, 27] 
};


// Hämtar rätt väderbild utifrån väderkoderna
function getWeatherDescription(code) {
    if (code === null) {
        return "moln";
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

// Uppdaterar vädret på sidan
function updateWeatherInfoText(infoText) {
    const weatherInfoElement = document.getElementById("weather-info");
    if (weatherInfoElement) {
        weatherInfoElement.textContent = infoText;
    } else {
        console.error("kan inte visa väder");
    }
}

//Uppdaterar väderikonen på sidan
function updateWeatherIcon(iconPath) {
    const weatherIconElement = document.getElementById("weather-icon");
    if (weatherIconElement) {
        weatherIconElement.src = iconPath;
    } else {
        console.error("fel med visningen utav väderikonen");
    }
}
