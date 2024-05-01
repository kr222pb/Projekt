//Globala variabler
let currentindex = 0;
let selectedActivities = [];
let obj;
let map
let lat
let lng
let allData = []
let numArrayCopy

function init() {
    fetchSMAPI()
    let bock = document.querySelector("#bock")
    bock.addEventListener("click", nextSlide)

    let kryss = document.querySelector("#kryss")
    kryss.addEventListener("click", function(e) {
        nextSlide(e);
    });

    document.querySelector("#info").addEventListener("click", makeMap)

}

window.addEventListener("load", init)

async function fetchSMAPI() {
    //URLer
    /*
        let aktivitet = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getall&descriptions=Temapark,Nöjespark,Älgpark,Djurpark,Simhall,Gokart,Zipline,Nöjescenter,Klippklättring,Paintballcenter, Hälsocenter,Golfbana,Bowlinghall,Nattklubb";
        let mat = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getall&descriptions=Restaurang,Pizzeria,Gatukök,Bistro,Cafe";
        let attraction = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=attraction&method=getall&descriptions=Museum,Slott,Konstgalleri,Ateljé,Glasbruk,Konsthall,Sevärdhet,Fornlämning,Hembygdspark,Naturreservat";
    */
    let aktivitet = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getall&descriptions=Temapark";
    let mat = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getall&descriptions=Cafe";
    let attraction = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=attraction&method=getall&descriptions=Fornlämning";

    try {
        // Gör flera API-anrop samtidigt
        let [response1, response2, response3] = await Promise.all([
            fetch(aktivitet),
            fetch(mat),
            fetch(attraction)
        ]);

        // Kontrollera om alla begäranden var framgångsrika
        if (!response1.ok || !response2.ok || !response3.ok) {
            throw new Error("Ett eller flera API-anrop misslyckades");
        }

        // Konvertera svaren till JSON
        let data = await Promise.all([
            response1.json(),
            response2.json(),
            response3.json()
        ]);

        readSMAPI(data);
    } catch (error) {
        // Hantera fel om något går fel vid något av anropen
        console.error("Fel vid hämtning:", error);
    }
}

function readSMAPI(data) {
    //Iterera över listan med listorna i
    for (let y = 0; y < data.length; y++) {

        // Iterera över datan och logga namnet på varje objekt   
        for (let x = 0; x < data[y].payload.length; x++) {
            obj = data[y].payload[x]
            allData.push(obj)

        }
    }
  //Veta hur många som finns i listan
    let numList = allData.length
    //Skapa arrayen
    let numArray = []
    for (let y = 0; y < numList; y++) {
        numArray.push(y)
    }  
      numArrayCopy = numArray.slice(0) 
      nextSlide()
}   

function nextSlide(e) {

    //Generera ett slumpmässigt index baserat på längden av numArrayCopy
    let randomIndex = Math.floor(Math.random() * numArrayCopy.length);
    
    //Ta bort det slumpmässigt valda numret från numArrayCopy
    let removedNumber = numArrayCopy.splice(randomIndex, 1); 
    
    //Ta bort objectet från listan 
    allData.splice(removedNumber, 1);

    //Hämta det nästa indexet i allData-listan
    let nextIndex = allData[randomIndex];
    
    //Skriva koden
    let HTMLCode = "<h2>" + nextIndex.name + "</h2>";
    HTMLCode += "<h3>" + nextIndex.description + "</h3>";
    HTMLCode += "<h4>" + nextIndex.abstract + "</h4>";

    // Uppdatera HTML-koden
    let h2 = document.querySelector(".container h2");
    h2.innerHTML = HTMLCode;

    // Uppdatera lat och lng
    lat = nextIndex.lat;
    lng = nextIndex.lng;

    // Uppdatera kartan
    makeMap(lat, lng);

    if (e.target.id == "bock") {
        let name = obj.name
        selectedActivities.push(name)
        console.log(selectedActivities)
    }
}





// Skapa en karta
function makeMap(lat, lng) {
    // Skapa en ikon för markören
    let icon = L.icon({
        iconUrl: 'bilder/plats.svg',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    });

    // Skapa kartan om den inte redan är skapad
    if (!map) {
        map = L.map("map").setView([lat, lng], 10)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)

        // Skapa markören och placera den på kartan
        marker = L.marker([lat, lng], { icon: icon }).addTo(map)
    } else {
        // Flytta kartans vy till de nya koordinaterna
        map.setView([lat, lng])

        // Ta bort den befintliga markören från kartan
        map.removeLayer(marker)

        // Skapa en ny markör och placera den på den nya positionen med din ikon
        marker = L.marker([lat, lng], { icon: icon }).addTo(map)
    }
}
