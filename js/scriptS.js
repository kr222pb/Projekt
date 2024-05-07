let combinedData = [];
let selectedActivities = [];
let lat;
let lng;

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
    container.innerHTML = `<h2>${obj.name}</h2>`+`<h3>${obj.setting}</h3>` ;
    lat = obj.lat;
    lng = obj.lng;
    console.log(`Lat: ${lat}, Lng: ${lng}`);

}

function nextSlide(e) {
    if (e.target.id === "bock") {
        selectedActivities.push(document.querySelector(".container h2").innerText);
        console.log(selectedActivities);
    }
  
    showRandomSuggestion();
}

window.addEventListener("load", init);