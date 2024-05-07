let combinedData = [];
let selectedActivities = [];
let lat;
let lng;
let map;
let marker;

function init() {
    console.time("Data Fetch Time");
    fetchSMAPI();  // Ladda initial data
    
}

function setupEventListeners() {
    document.querySelector("#bock").addEventListener("click", nextSlide);
    document.querySelector("#kryss").addEventListener("click", nextSlide);
}

async function fetchSMAPI() {
    const urls = [
        "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getall&descriptions=Temapark,Nöjespark,Älgpark,Djurpark,Simhall,Gokart,Zipline,Nöjescenter,Klippklättring,Paintballcenter,Hälsocenter,Golfbana,Bowlinghall,Nattklubb",
        "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getall&descriptions=Restaurang,Pizzeria,Gatukök,Bistro,Cafe",
        "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=attraction&method=getall&descriptions=Museum,Slott,Konstgalleri,Ateljé,Glasbruk,Konsthall,Sevärdhet,Fornlämning,Hembygdspark,Naturreservat"
    ];

    try {
        for (const url of urls) {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Fel vid hämtning av data");

            const jsonData = await response.json();
            combinedData.push(...jsonData.payload);
        }
        console.timeEnd("Data Fetch Time");

        // Visa ett slumpmässigt objekt
        showRandomSuggestion();
        setupEventListeners();
    } catch (error) {
        console.error("Fel vid hämtning:", error);
    }
}
function showRandomSuggestion() {
    const randomIndex = Math.floor(Math.random() * combinedData.length);
    updateUI(combinedData[randomIndex]);
}

function updateUI(obj) {
    const container = document.querySelector(".container h2");
    container.innerHTML = `<h2>${obj.name}</h2>`+`<h3>${obj.description}</h3>` ;
    lat = obj.lat;
    lng = obj.lng;
    console.log(`Lat: ${lat}, Lng: ${lng}`);
    makeMap(lat, lng);

}

function nextSlide(e) {
    if (e.target.id === "bock") {
        selectedActivities.push(document.querySelector(".container h2").innerText);
        console.log(selectedActivities);
    }
    
    showRandomSuggestion();

}
function makeMap(lat, lng) {
    // Skapa anpassad ikon för platsmarkören
    const icon = L.icon({
        iconUrl: 'bilder/plats.svg',  // Anpassa sökvägen till din ikonfil
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });

    // Skapa eller återanvända kartan
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

    // Lägg till markören på kartan
    marker = L.marker([lat, lng], { icon: icon }).addTo(map);
}


window.addEventListener("load", init);