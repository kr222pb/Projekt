combinedData = [];
let filteredData = [];
let cityD = [];
let provinceD = [];
let currentIndex = 0;
let lat, lng, map, marker;
let img

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
        showRandomItemsInList();
    } catch (error) {
        console.error("Fel vid hämtning:", error);
    }
}

function setupCityListeners() {
    const navLinks = document.querySelectorAll(".nav-menu a[data-stad], .nav-menu a[data-provins]");
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
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
    const excludedDescriptions = ["Lekplats","kyrka", "Lekland", "Hamburgerkedja"];

    // Samla alla aktiva städer
    const activeCities = [...document.querySelectorAll(".nav-menu a.active[data-stad]")].map(link => link.getAttribute("data-stad"));
    const activeProvinces = [...document.querySelectorAll(".nav-menu a.active[data-provins]")].map(link => link.getAttribute("data-provins"));


    // Filtrera datan efter de valda städerna och typer
    filteredData = combinedData.filter(item => {
        const isCitySelected = activeCities.includes(item.city);
        const isProvinceSelected = activeProvinces.includes(item.province);
        const isTypeAllowed = allowedTypes.includes(item.type);

        const isDescriptionExcluded = excludedDescriptions.some(desc => item.description?.toLowerCase().includes(desc.toLowerCase()));

        return (isCitySelected || isProvinceSelected) && isTypeAllowed && !isDescriptionExcluded;
    });
    console.log("Filtered data:", filteredData);

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
function chooseImg(description) {
    const groupA = ["Temapark", "Nöjespark", "Älgpark", "Djurpark"];
    const groupB = ["Simhall", "Gokart", "Zipline", "Bowlinghall", "Golfbana", "Klippklättring", "Paintballcenter", "Museum","Biograf", "Skateboardpark"];
    const groupC = ["Hälsocenter", "Nöjescenter"];
    const groupD = ["Nattklubb", "Restaurang", "Pizzeria", "Gatukök", "Bistro", "Cafe"];
    const groupE = ["Slott", "Sevärdhet", "Fornlämning", "Hembygdspark", "Naturreservat"];
    const groupF = ["Konstgalleri", "Ateljé", "Glasbruk", "Konsthall"];

    let category;
    if (groupA.includes(description)) {
        category = "A";
    } else if (groupB.includes(description)) {
        category = "B";
    } else if (groupC.includes(description)) {
        category = "C";
    } else if (groupD.includes(description)) {
        category = "D";
    } else if (groupE.includes(description)) {
        category = "E";
    } else if (groupF.includes(description)) {
        category = "F";
    } else {
        category = "Unknown";
    }

    switch (category) {
        case "A":
            return "bilder/a.png";
        case "B":
            return "bilder/b.png";
        case "C":
            return "bilder/c.png";
        case "D":
            return "bilder/d.png";
        case "E":
            return "bilder/e.png";
        default:
            return "bilder/f.png";
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
    const container = document.querySelector(".container");
    if (container) {
        
        const imageWrapper = container.querySelector(".image-wrapper");
        const img = chooseImg(obj.description);

        let imgElement = imageWrapper.querySelector(".swipe");
        if (imgElement) {
            imgElement.src = img;
            imgElement.alt = obj.name;
        } else {
            imgElement = document.createElement("img");
            imgElement.classList.add("swipe");
            imgElement.src = img;
            imgElement.alt = obj.name;
            imageWrapper.appendChild(imgElement);
        }
        container.querySelector("h2").innerHTML =
        `<h2>${obj.name}</h2>` +
        `<h3>${obj.description}</h3>`;
        container.querySelector(".item__overlay h3").textContent = `Information om ${obj.name}`;
        container.querySelector(".item__body").innerHTML = `<p>${obj.abstract}</p>`;
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
function showRandomItemsInList() {
    const listUtf = document.getElementById("listUtf");
    listUtf.innerHTML = ""; // Rensa befintligt innehåll

    // Skapa en lista med 10 slumpmässiga index
    const randomIndexes = [];
    while (randomIndexes.length < 10) {
        const randomIndex = Math.floor(Math.random() * combinedData.length);
        if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
        }
    }

    // Skapa listelement för varje slumpmässigt valt objekt och lägg till dem i listUtf
    randomIndexes.forEach(index => {
        const item = combinedData[index];
        const listItem = document.createElement("div");
        listItem.classList.add("list-item");
        listItem.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p>Pris: ${item.price_range}</p>
    `;
        listUtf.appendChild(listItem);
    });
}

window.addEventListener("load", init);

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