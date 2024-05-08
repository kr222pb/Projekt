combinedData = [];
let filteredData = [];
let cityD=[];
let provinceD =[];
let currentIndex = 0;
let lat, lng, map, marker;

function init() {
    console.time("Data Fetch Time");
    fetchAllEstablishmentData();
    setupEventListeners();
}

async function fetchAllEstablishmentData() {
    const url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fel vid hämtning av data");

        const jsonData = await response.json();
        combinedData = jsonData.payload;
        console.timeEnd("Data Fetch Time");
        for (const item of combinedData) {
            if (item.city) {
                cityD.push(item);
            } else if (item.province) {
                provinceD.push(item);
            }
        }

        setupCityListeners();
    } catch (error) {
        console.error("Fel vid hämtning:", error);
    }
}

function setupCityListeners() {
    const navLinks = document.querySelectorAll(".nav-menu a[data-stad], .nav-menu a[data-provins]");
    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            this.classList.toggle("active");
            filterAndShow();
        });
    });
}
function setupEventListeners() {
    document.querySelector("#bock").addEventListener("click", nextSlide);
    document.querySelector("#kryss").addEventListener("click", nextSlide);
}

function filterAndShow() {
    localStorage.removeItem("savedActivity");
    const allowedTypes = ["activity", "food", "attraction"];

    // Samla alla aktiva städer
    const activeCities = [...document.querySelectorAll(".nav-menu a.active[data-stad]")].map(link => link.getAttribute("data-stad"));
    const activeProvinces = [...document.querySelectorAll(".nav-menu a.active[data-provins]")].map(link => link.getAttribute("data-provins"));
    

    // Filtrera datan efter de valda städerna och typer
    filteredData = combinedData.filter(item => {
        const isCitySelected = activeCities.includes(item.city);
        const isProvinceSelected = activeProvinces.includes(item.province);
        const isTypeAllowed = allowedTypes.includes(item.type);

        // Include the item if it's in a selected city/province and matches one of the allowed types
        return (isCitySelected || isProvinceSelected) && isTypeAllowed;
    });

    // Blanda resultatet slumpmässigt
    shuffleArray(filteredData);

    currentIndex = 0; 
    showCurrentSuggestion();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showCurrentSuggestion() {
    if (filteredData.length > 0 && currentIndex < filteredData.length) {
        updateUI(filteredData[currentIndex]);
    } else {
        const container = document.querySelector(".container h2");
        if (container) {
            container.innerHTML = `<h2>Inga resultat</h2>`;
        } else {
            console.error("Container element not found");
        }
    }
}

function nextSlide(e) {
    if (e.target.id === "bock" && currentIndex < filteredData.length) {
        
        const savedSuggestions = JSON.parse(localStorage.getItem("savedActivity")) || [];
        savedSuggestions.push(filteredData[currentIndex]);
        localStorage.setItem("savedActivity", JSON.stringify(savedSuggestions));
        
        console.log(`Accepted: ${filteredData[currentIndex].name}`);
    }

    currentIndex++;
    if (currentIndex >= filteredData.length) {
        currentIndex = 0;
    }

    showCurrentSuggestion();
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