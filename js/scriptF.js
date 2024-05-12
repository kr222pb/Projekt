//Globala variabler
let currentindex = 0;
let selectedActivities = [];
let obj;
let map;
let lat;
let lng;
let allData = [];
let numArrayCopy;

let selected_lat;
let selected_lng;

function init() {
    console.log("1")
    display()
    let bock = document.querySelector("#bock");
    bock.addEventListener("click", nextSlide);

    let kryss = document.querySelector("#kryss");
    kryss.addEventListener("click", nextSlide);
    document.querySelector("#info").addEventListener("click", makeMap);

    //Referens till elemntet i HTML-koden
    let Växjö = document.querySelector('a[data-stad="Växjö"]');
    Växjö.addEventListener("click", makeURL)

    let Kalmar = document.querySelector('a[data-stad="Kalmar"]');
    Kalmar.addEventListener("click", makeURL)

    let Karlskrona = document.querySelector('a[data-stad="Karlskrona"]');
    Karlskrona.addEventListener("click", makeURL)

    let Värnamo = document.querySelector('a[data-stad="Värnamo"]');
    Värnamo.addEventListener("click", makeURL)

    let Alvesta = document.querySelector('a[data-stad="Alvesta"]');
    Alvesta.addEventListener("click", makeURL)

    let Oskarshamn = document.querySelector('a[data-stad="Oskarshamn"]');
    Oskarshamn.addEventListener("click", makeURL)

    let Vimmerby = document.querySelector('a[data-stad="Vimmerby"]');
    Vimmerby.addEventListener("click", makeURL)

    let Jönköping = document.querySelector('a[data-stad="Jönköping"]');
    Jönköping.addEventListener("click", makeURL)


    let Öland = document.querySelector('a[data-stad="Öland"]');
    Öland.addEventListener("click", makeURL)
}
window.addEventListener("load", init);

function makeURL() {
    let Växjö_latlng = ["56.8767", "14.8039"];
    let Kalmar_latlng = ["56.6616", "16.3600"];
    let Karlskrona_latlng = ["56.1663", "15.5851"];
    let Värnamo_latlng = ["57.18631", "14.03626"];
    let Alvesta_latlng = ["56.8991", "14.5565"];
    let Oskarshamn_latlng = ["57.2626", "16.4574"];
    let Vimmerby_latlng = ["57.6632", "15.8582"];
    let jönköping_latlng = ["57.7849", "14.1632"];
    let Öland_latlng = ["56.6517", "16.4723"];

    selected_lat = ""
    selected_lng = ""

    let city = this;
    city.classList.toggle("added");

    switch (city.getAttribute("data-stad")) {
        case "Växjö":
            if (city.classList.contains("added")) {
                selected_lat = Växjö_latlng[0];
                selected_lng = Växjö_latlng[1];
            }
            break;
        case "Kalmar":
            if (city.classList.contains("added")) {
                selected_lat = Kalmar_latlng[0];
                selected_lng = Kalmar_latlng[1];
            }
            break;
        case "Karlskrona":
            if (city.classList.contains("added")) {
                selected_lat = Karlskrona_latlng[0];
                selected_lng = Karlskrona_latlng[1];
            }
            break;
        case "Värnamo":
            if (city.classList.contains("added")) {
                selected_lat = Värnamo_latlng[0];
                selected_lng = Värnamo_latlng[1];
            }
            break;
        case "Alvesta":
            if (city.classList.contains("added")) {
                selected_lat = Alvesta_latlng[0];
                selected_lng = Alvesta_latlng[1];
            }
            break;
        case "Oskarshamn":
            if (city.classList.contains("added")) {
                selected_lat = Oskarshamn_latlng[0];
                selected_lng = Oskarshamn_latlng[1];
            }
            break;
        case "Vimmerby":
            if (city.classList.contains("added")) {
                selected_lat = Vimmerby_latlng[0];
                selected_lng = Vimmerby_latlng[1];
            }
            break;
        case "Jönköping":
            if (city.classList.contains("added")) {
                selected_lat = jönköping_latlng[0];
                selected_lng = jönköping_latlng[1];
            }
            break;
        case "Öland":
            if (city.classList.contains("added")) {
                selected_lat = Öland_latlng[0];
                selected_lng = Öland_latlng[1];
            }
            break;
        default:
            // Om ingen matchande stad hittades, gör inget
            break;
    }
    fetchSMAPI();
}

async function fetchSMAPI() {
    // URLer
    let aktivitet = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getfromlatlng&lat=" + selected_lat + "&lng=" + selected_lng + "&radius=50&descriptions=Temapark,Nöjespark,Älgpark,Djurpark,Simhall,Gokart,Zipline,Nöjescenter,Klippklättring,Paintballcenter, Hälsocenter,Golfbana,Bowlinghall,Nattklubb";

    let mat = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getfromlatlng&lat=" + selected_lat + "&lng=" + selected_lng + "&radius=50&descriptions=Restaurang,Pizzeria,Gatukök,Bistro,Cafe";

    let attraction = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=attraction&method=getfromlatlng&lat=" + selected_lat + "&lng=" + selected_lng + "&radius=50&descriptions=Museum,Slott,Konstgalleri,Ateljé,Glasbruk,Konsthall,Sevärdhet,Fornlämning,Hembygdspark,Naturreservat";

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
        console.error("Fel vid hämtning:", error);
    }
}

function readSMAPI(data) {
    // Iterera över listan med listorna
    for (let y = 0; y < data.length; y++) {
        // Iterera över datan och logga namnet på varje objekt
        for (let x = 0; x < data[y].payload.length; x++) {
            obj = data[y].payload[x];
            allData.push(obj);
        }
    }
    //Veta hur många som finns i listan
    let numList = allData.length;
    //Skapa arrayen
    let numArray = [];
    for (let y = 0; y < numList; y++) {
        numArray.push(y);
    }
    numArrayCopy = numArray.slice(0);
    nextSlide();
}

function nextSlide(e) {
    e = this;
    let randomIndex = Math.floor(Math.random() * numArrayCopy.length);
    let removedNumber = numArrayCopy.splice(randomIndex, 1);
    let nextIndex = allData[randomIndex];
    let img;

    function choseImg() {
        let a = ["Klippklättring", "Naturreservat"];
        let b = ["Simhall"];
        let c = ["Sevärdhet", "Fornlämning"];
        let d = ["Älgpark", "Djurpark", "Temapark"]
        let e = ["Glasbruk"];
        let f = ["Konstgalleri", "Ateljé", "Konsthall"];
        let g = ["Restaurang", "Bistro"]
        let h = ["Gatukök"]
        let i = ["Gokart"]
        let j = ["Zipline"]
        let k = ["Bowlinghall", "Nöjescenter"]
        let l = ["Cafe"]
        let m = ["Pizzeria"]
        let n = ["Paintballcenter"]
        let o = ["Nattklubb"]
        let p = ["Hälsocenter"]
        let q = ["Hembygdspark"]
        let r = ["Museum", "Slott"]
    
    
        let category;
        if (a.includes(nextIndex.description)) {
            category = "A";
        } else if (b.includes(nextIndex.description)) {
            category = "B";
        } else if (c.includes(nextIndex.description)) {
            category = "C";
        } else if (d.includes(nextIndex.description)) {
            category = "D";
        } else if (e.includes(nextIndex.description)) {
            category = "E";
        } else if (f.includes(nextIndex.description)) {
            category = "F";
        } else if (f.includes(nextIndex.description)) {
            category = "G";
        } else if (f.includes(nextIndex.description)) {
            category = "H";
        } else if (f.includes(nextIndex.description)) {
            category = "I";
        } else if (f.includes(nextIndex.description)) {
            category = "J";
        } else if (f.includes(nextIndex.description)) {
            category = "K";
        } else if (f.includes(nextIndex.description)) {
            category = "L";
        } else if (f.includes(nextIndex.description)) {
            category = "M";
        } else if (f.includes(nextIndex.description)) {
            category = "N";
        } else if (f.includes(nextIndex.description)) {
            category = "O";
        } else if (f.includes(nextIndex.description)) {
            category = "P";
        } else if (f.includes(nextIndex.description)) {
            category = "K";
        } else if (f.includes(nextIndex.description)) {
            category = "R";
        } else {
            category = "Okänd kategori";
        }
    
        switch (category) {
            case "A":
                img = "Foto/klippa.jpg";
                break;
            case "B":
                img = "Foto/simhall.jpg";
                break;
            case "C":
                img = "Foto/runsten.jpg";
                break;
            case "D":
                img = "Foto/Djur.jpg";
                break;
            case "E":
                img = "Foto/glaskonst.jpg";
                break;
            case "F":
                img = "Foto/tavla.jpg";
                break;
            case "G":
                img = "Foto/gatukök.jpg";
                break;
            case "H":
                img = "Foto/gatukök.jpg";
                break;
            case "I":
                img = "Foto/gatukök.jpg";
                break;
            case "J":
                img = "Foto/träd.jpg";
                break;
            case "K":
                img = "Foto/gatukök.jpg";
                break;
            case "L":
                img = "Foto/gatukök.jpg";
                break;
            case "M":
                img = "Foto/gatukök.jpg";
                break;
            case "N":
                img = "Foto/gatukök.jpg";
                break;
            case "O":
                img = "Foto/gatukök.jpg";
                break;
            case "P":
                img = "Foto/gatukök.jpg";
                break;
            case "Q":
                img = "Foto/hus.jpg";
                break;
            case "R":
                img = "Foto/slott.jpg";
                break;
            default:
                img = "";
        }
    }

    choseImg();

    let HTMLCode = '<img class="swipe" src="' + img + '">' +
        "<h2>" + nextIndex.name + "</h2>" +
        "<h3>" + nextIndex.description + "</h3>" +
        "<h4>" + nextIndex.abstract + "</h4>";

    let container = document.querySelector(".container");
    container.innerHTML = HTMLCode;

    let open = document.querySelector("#opening-hours-container p")

    lat = nextIndex.lat;
    lng = nextIndex.lng;

    makeMap(lat, lng);

    if (e.id != "bock") {
        let name = nextIndex.name;
        selectedActivities.push(name);
        console.log(selectedActivities);
        saveData()
    }
    console.log(selectedActivities)

}

function makeMap(lat, lng) {
    let icon = L.icon({
        iconUrl: 'bilder/plats.svg',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    });

    if (!map) {
        map = L.map("map").setView([lat, lng], 10);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    } else {
        map.setView([lat, lng]);
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lng], { icon: icon }).addTo(map);
}

function display() {
    console.log("Annanas");
    selectedActivities = ["Banan", "Melon", "Kiwi", "Citron", "Annans"];
    console.log(selectedActivities);

    let msg = document.querySelector("#msg");

    // Skapa ett ul-element för listan
    let ulElement = document.createElement("ul");

    // Loopa igenom varje aktivitet och skapa ett li-element för varje
    for (let x = 0; x < selectedActivities.length; x++) {
        // Skapa ett li-element för den aktuella aktiviteten
        let imgElem = document.createElement("img")
        let liElement = document.createElement("li");
        // Ange textinnehållet för li-elementet
        liElement.textContent = selectedActivities[x];
        imgElem.src = "bilder/soptunna.svg"
        imgElem.setAttribute("id", "soptunna")
        imgElem.addEventListener("click",tabort) 
        // Lägg till li-elementet som ett barn till ul-elementet
        ulElement.appendChild(liElement);
        liElement.appendChild(imgElem)


    
    }

    // Lägg till ul-elementet (listan) som ett barn till msg-elementet
    msg.appendChild(ulElement);


}

function tabort() {
    // Hämta referensen till det aktuella li-elementet (där bilden klickades)
    let liElement = this.parentNode;

    // Hämta textinnehållet för li-elementet
    let text = liElement.textContent.trim();

    // Ta bort den aktuella aktiviteten från arrayen selectedActivities
    let index = selectedActivities.indexOf(text);
    if (index !== -1) {
        selectedActivities.splice(index, 1);
    }

    // Uppdatera listan på webbsidan
    liElement.parentNode.removeChild(liElement);

    console.log(selectedActivities);
}


function saveData() {
    let data = selectedActivities
    console.log("Kiwi")
    localStorage.setItem('myArray', data);
}