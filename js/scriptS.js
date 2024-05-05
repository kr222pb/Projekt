let currentindex = 0;
let selectedActivities = [];
let data; // Global variabel för att hålla data
let lat;
let lng;

function init() {
    fetchSMAPI("attraction");  // Ladda initial data
    
}

function setupEventListeners() {
    document.querySelector("#bock").addEventListener("click", nextSlide);
    document.querySelector("#kryss").addEventListener("click", nextSlide);
}

async function fetchSMAPI(type) {
    const urls = {
        "aktivitet": "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getall&descriptions=Temapark,Nöjespark,Älgpark,Djurpark,Simhall,Gokart,Zipline,Nöjescenter,Klippklättring,Paintballcenter,Hälsocenter,Golfbana,Bowlinghall,Nattklubb",
        "mat": "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getall&descriptions=Restaurang,Pizzeria,Gatukök,Bistro,Cafe",
        "attraction": "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=attraction&method=getall&descriptions=Museum,Slott,Konstgalleri,Ateljé,Glasbruk,Konsthall,Sevärdhet,Fornlämning,Hembygdspark,Naturreservat"
    };

    let response = await fetch(urls[type]);
    if (response.ok) {
        data = await response.json();
        updateUI(data.payload[currentindex]);
        setupEventListeners(); 
    } else {
        console.error("Error fetching data:", response.status);
    }
}

function updateUI(obj) {
    const container = document.querySelector(".container h2");
    container.innerHTML = `<h2>${obj.name}</h2>`,`<h3>${obj.description}</h3>` ;
    lat = obj.lat;
    lng = obj.lng;
    console.log(`Lat: ${lat}, Lng: ${lng}`);

}

function nextSlide(e) {
    if (e.target.id === "bock") {
        selectedActivities.push(data.payload[currentindex].name);
        console.log(selectedActivities);
    }
  
    currentindex++;
    if (currentindex >= data.payload.length) {
        currentindex = 0; // Återställ index om det når slutet av listan
    }
    updateUI(data.payload[currentindex]); // Uppdatera med nytt objekt baserat på index
}

window.addEventListener("load", init);