let combinedData = [];
let filteredData = [];
let currentIndex = 0;
let lat, lng, map, marker;

function init() {
    console.time("Data Fetch Time");
    fetchAllEstablishmentData();
    setupEventListeners(); // Flyttad till init
}

async function fetchAllEstablishmentData() {
    const apiKey = "61fTJHBb";
    const url = `https://smapi.lnu.se/api/?api_key=${apiKey}&controller=establishment&method=getall`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fel vid hämtning av data");

        const jsonData = await response.json();
        combinedData = jsonData.payload;
        console.timeEnd("Data Fetch Time");

        setupCityListeners();
    } catch (error) {
        console.error("Fel vid hämtning:", error);
    }
}

function setupCityListeners() {
    const cityLinks = document.querySelectorAll(".nav-link[data-stad]");
    cityLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const selectedCity = this.getAttribute("data-stad");
            filterAndShow(selectedCity);
        });
    });
}

function setupEventListeners() {
    document.querySelector("#bock").addEventListener("click", nextSlide);
    document.querySelector("#kryss").addEventListener("click", nextSlide);
}

function filterAndShow(city) {
    filteredData = combinedData.filter(item => item.city === city);
    console.log(`Filtered data for ${city}:`, filteredData);
    currentIndex = 0; // Återställ index till början
    showCurrentSuggestion();
}

function showCurrentSuggestion() {
    if (filteredData.length > 0 && currentIndex < filteredData.length) {
        // Visa objektet om indexet är giltigt
        updateUI(filteredData[currentIndex]);
    } else {
        const container = document.querySelector(".container h2");
        if (container) {
            container.innerHTML = `<h2>Inga resultat eller ogiltigt index</h2>`;
        } else {
            console.error("Container not found");
        }
    }
}

function nextSlide(e) {
    if (e.target.id === "bock" && currentIndex < filteredData.length) {
        // Godkänn den nuvarande aktiviteten
        console.log(`Accepted: ${filteredData[currentIndex].name}`);
    }
    
    // Öka index och kontrollera gränserna
    currentIndex++;
    if (currentIndex >= filteredData.length) {
        currentIndex = 0; // Alternativt återställ eller stanna vid slutet
    }
    
    showCurrentSuggestion(); // Visa nästa objekt eller meddelande
}

function updateUI(obj) {
    const container = document.querySelector(".container h2");
    if (container) {
        container.innerHTML = `<h2>${obj.name}</h2><h3>${obj.description}</h3>`;
    } else {
        console.error("Container element not found");
    }
    lat = obj.lat;
    lng = obj.lng;
    console.log(`Lat: ${lat}, Lng: ${lng}`);
    makeMap(lat, lng);
}

function makeMap(lat, lng) {
    const icon = L.icon({
        iconUrl: 'bilder/plats.svg',
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });

    if (!map) {
        map = L.map('map').setView([lat, lng], 10);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    } else {
        map.setView([lat, lng]);
        if (marker) {
            map.removeLayer(marker);
        }
    }

    marker = L.marker([lat, lng], { icon: icon }).addTo(map);
}

window.addEventListener("load", init);