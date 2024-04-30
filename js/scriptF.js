//Globala variabler
let currentindex = 0;
let selectedActivities = [];
let obj;
let map

function init() {
    fetchSMAPI()
    let bock = document.querySelector("#bock")
    bock.addEventListener("click", nextSlide)

    let kryss = document.querySelector("#kryss")
    kryss.addEventListener("click", nextSlide)

    document.querySelector("#info").addEventListener("click",makeMap)

}

window.addEventListener("load", init)

async function fetchSMAPI() {
    //URLer
    let aktivitet = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getall&descriptions=Temapark,Nöjespark,Älgpark,Djurpark,Simhall,Gokart,Zipline,Nöjescenter,Klippklättring,Paintballcenter, Hälsocenter,Golfbana,Bowlinghall,Nattklubb"

    let mat = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getall&descriptions=Restaurang,Pizzeria,Gatukök,Bistro,Cafe"

    let attraction = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=attraction&method=getall&descriptions=Museum,Slott,Konstgalleri,Ateljé,Glasbruk,Konsthall,Sevärdhet,Fornlämning,Hembygdspark,Naturreservat"
    // Hämta data från SMAPI
    //Detta måste bli en funkton som kräver indata
    let response = await fetch(aktivitet)

    // Kontrollera om begäran var framgångsrik
    if (response.ok) {
        console.log("Banan")
        // Konvertera den hämtade JSON-datamängden till ett JavaScript-objekt
        let data = await response.json()
        // Skicka den konverterade datan till funktionen readSMAPI
        readSMAPI(data)
    }
    else {
        // Hantera fel om begäran inte var framgångsrik
        console.log("Fel vid hämtning:", response.status)
    }

}

let lat
let lng

function readSMAPI(data) {
    let HTMLCode = ""
    // Iterera över datan och logga namnet på varje objekt
    for (let x = 0; x < data.payload.length; x++) {
        obj = data.payload[currentindex]

        //Skriva koden
        HTMLCode = "<h2>" + obj.name + "</h2>"
        HTMLCode += "<h3>" + obj.description + "</h3>"
        HTMLCode += "<h4>" + obj.abstract + "</h4>"
        let h2 = document.querySelector(".container h2")
        h2.innerHTML = HTMLCode
        lat = obj.lat
        lng = obj.lng
        console.log(lat,lng)
       
    }
 makeMap(lat,lng)
}


function nextSlide(e) {
    console.log("Annans")
    if (e.target.id == "bock") {
        console.log("Val gjort")
        let kiwi = obj.name
        selectedActivities.push(kiwi)
        console.log(selectedActivities)

    }

    currentindex++
    fetchSMAPI()
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
