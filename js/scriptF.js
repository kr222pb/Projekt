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
    kryss.addEventListener("click", nextSlide)
    document.querySelector("#info").addEventListener("click", makeMap)

}

window.addEventListener("load", init)

async function fetchSMAPI() {
   let växjö_latlng = 56.8767 14.8039
    let kalmar_latlng = 56.6616 16.3600
    let karlskrona_latlng = 56.1663 15.5851
    let värnamo_latlng = 57.18631 14.03626
    let alvesta_latlng = 56.8991 14.5565
    let orskashamn_latlng = 57.2626 16.4574
    let vimmerby_latlng = 57.6632 15.8582
    let jönköping_latlng = 57.7849 14.1632
    let öland_latlng = 56.6517 16.4723


    let växjö = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&cities=V%C3%A4xj%C3%B6&descriptions=Simhall,Nöjescenter,Bowlinghall,Resturang,Pizzeria,Gatukök,Bistro,Museum,Konsthall,Konstgalleri,Sevärdighet,Slott,Nattklubb,Biograf,Cafe,Naturreservat"

 
    let kalmar = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&cities=kalmar&descriptions=Simhall,Nöjescenter,Bowlinghall,Resturang,Pizzeria,Gatukök,Bistro,Museum,Konsthall,Konstgalleri,Sevärdighet,Slott,Nattklubb,Biograf,Cafe,Naturreservat"

    let karlskrona = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&cities=karlskrona&descriptions=Simhall,Nöjescenter,Bowlinghall,Resturang,Pizzeria,Gatukök,Bistro,Museum,Konsthall,Konstgalleri,Sevärdighet,Slott,Nattklubb,Biograf,Cafe,Naturreservat"

    let värnamo = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&cities=vänamo&descriptions=Simhall,Nöjescenter,Bowlinghall,Resturang,Pizzeria,Gatukök,Bistro,Museum,Konsthall,Konstgalleri,Sevärdighet,Slott,Nattklubb,Biograf,Cafe,Naturreservat"

    let alvesta = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&cities=alvesta&descriptions=Simhall,Nöjescenter,Bowlinghall,Resturang,Pizzeria,Gatukök,Bistro,Museum,Konsthall,Konstgalleri,Sevärdighet,Slott,Nattklubb,Biograf,Cafe,Naturreservat"

    let oskarshamn = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&cities=oskarshamn&descriptions=Simhall,Nöjescenter,Bowlinghall,Resturang,Pizzeria,Gatukök,Bistro,Museum,Konsthall,Konstgalleri,Sevärdighet,Slott,Nattklubb,Biograf,Cafe,Naturreservat"

    let vimmerby = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&cities=vimmerby&descriptions=Simhall,Nöjescenter,Bowlinghall,Resturang,Pizzeria,Gatukök,Bistro,Museum,Konsthall,Konstgalleri,Sevärdighet,Slott,Nattklubb,Biograf,Cafe,Naturreservat"

    let jönköping = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&cities=jönköping&descriptions=Simhall,Nöjescenter,Bowlinghall,Resturang,Pizzeria,Gatukök,Bistro,Museum,Konsthall,Konstgalleri,Sevärdighet,Slott,Nattklubb,Biograf,Cafe,Naturreservat"

    let öland = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&provinces=öland&descriptions=Simhall,Nöjescenter,Bowlinghall,Resturang,Pizzeria,Gatukök,Bistro,Museum,Konsthall,Konstgalleri,Sevärdighet,Slott,Nattklubb,Biograf,Cafe,Naturreservat"

    try {
        let response = await fetch(karlskrona);
        if (!response.ok) {
            throw new Error("Ett eller flera API-anrop misslyckades");
        }
        let data = await response.json(); // Konvertera svaret till JSON
        readSMAPI(data);
    } catch (error) {
        console.error("Fel vid hämtning:", error);
    }
}

function readSMAPI(data) {
    //Iterera över listan med objekt i datan
    for(let x=0; x<data.payload.length; x++){
        obj=data.payload[x]
        allData.push(obj)
        console.log(allData)
    }
    nextSlide();
}

function nextSlide() {
    e = this
    //Generera ett slumpmässigt index baserat på längden av allData
    let randomIndex = Math.floor(Math.random() * allData.length);
    
    //Hämta det slumpmässigt valda objektet från allData
    let nextIndex = allData[randomIndex];
    
    //Skriv ut objektet
    let HTMLCode = "<h2>" + nextIndex.name + "</h2>";
    HTMLCode += "<h3>" + nextIndex.description + "</h3>";
    HTMLCode += "<h4>" + nextIndex.abstract + "</h4>";

    //Uppdatera HTML-koden
    let h2 = document.querySelector(".container h2");
    h2.innerHTML = HTMLCode;

    //Uppdatera lat och lng
    lat = nextIndex.lat;
    lng = nextIndex.lng;

    //Uppdatera kartan
    makeMap(lat, lng);

    //Om det inte är en klick från bock-knappen, lägg till objektets namn till selectedActivities
    if (e.id != "bock") {
        let name = nextIndex.name;
        selectedActivities.push(name);
        console.log(selectedActivities);
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
