combinedData = [];
let filteredData = [];
let cityD = [];
let provinceD = [];
let currentIndex = 0;
let lat, lng, map, marker;
let img

function init() {
    fetchAllEstablishmentData();
    setupEventListeners();

    const savedActivities = JSON.parse(localStorage.getItem("savedActivity")) || [];
    localStorage.setItem("savedActivity", JSON.stringify(savedActivities));
    
    setupFadeEffect(); //fade för textinfo
}

window.addEventListener("load", init);


async function fetchAllEstablishmentData() {
    const url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fel vid hämtning av data");

        const jsonData = await response.json();
        combinedData = jsonData.payload;
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
    const allowedTypes = ["activity", "food", "attraction"];
    const includedDescriptions = [ "Restaurang", "Bistro", "Biograf", "Cafe", "Naturreservat", "Bowlinghall", "Nöjescenter",  "Museum", "Slott"];

    // Samla alla aktiva städer
    const activeCities = [...document.querySelectorAll(".nav-menu a.active[data-stad]")].map(link => link.getAttribute("data-stad"));
    const activeProvinces = [...document.querySelectorAll(".nav-menu a.active[data-provins]")].map(link => link.getAttribute("data-provins"));

    // Filtrerar datan efter de valda städerna och typer
    filteredData = combinedData.filter(item => {
        const isCitySelected = activeCities.includes(item.city);
        const isProvinceSelected = activeProvinces.includes(item.province);
        const isTypeAllowed = allowedTypes.includes(item.type);

        const isDescriptionIncluded = includedDescriptions.some(desc => item.description?.toLowerCase().includes(desc.toLowerCase()));

        return (isCitySelected || isProvinceSelected) && isTypeAllowed && isDescriptionIncluded;
    });
   

    shuffleArray(filteredData);

    currentIndex = 0;
    showCurrentSuggestion();
}
// Blandar resultatet slumpmässigt
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function chooseImg(description) {
    let g = ["Restaurang", "Bistro"]
    let k = ["Biograf"]
    let l = ["Cafe"]
    let m = ["Naturreservat"]
    let o = ["Bowlinghall", "Nöjescenter"]
    let r = ["Museum", "Slott"]

    let category;
    if (g.includes(description)) {
        category = "G";
    } else if (k.includes(description)) {
        category = "K";
    } else if (l.includes(description)) {
        category = "L";
    } else if (m.includes(description)) {
        category = "M";
    } else if (o.includes(description)) {
        category = "O";
    } else if (r.includes(description)) {
        category = "R";
    } else {
        category = "Okänd kategori";
    }


    switch (category) {
        case "G":
            return "Foto/mat.jpg";
        case "K":
            return "Foto/popcorn.jpg";
        case "L":
            return "Foto/bulle.jpg";
        case "M":
            return "Foto/stig.jpg";
        case "O":
            return "Foto/disco.jpg";
        case "R":
            return "Foto/slott.jpg";
        default:
            return "bilder/logo.svg";
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

        const currentActivity = filteredData[currentIndex];
        const savedActivity = {
            name: currentActivity.name,
            addedAt: new Date().toLocaleString(), // Lägger till den aktuella tiden
            description: currentActivity.description || "Ingen beskrivning tillgänglig.",
            type: currentActivity.type || "Ej angiven",
            city: currentActivity.city || currentActivity.province || "Ej angiven",
            price_range: currentActivity.price_range || "Ej angiven",
            rating: currentActivity.rating || 0,
            abstract: currentActivity.abstract || "Ingen beskrivning tillgänglig.",
            website: currentActivity.website || "Ingen websida är tillgänglig.",
            id: currentActivity.id,
            lat: currentActivity.lat,
            lng: currentActivity.lng
        };

        // Kontrollerar om aktiviteten redan finns i den sparade listan
        const activityExists = savedSuggestions.some(activity => activity.name === savedActivity.name);
        
        if (!activityExists) {
            savedSuggestions.push(savedActivity);
            localStorage.setItem("savedActivity", JSON.stringify(savedSuggestions)); // Uppdatera nyckeln här
        }
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

        let imgElement = imageWrapper.querySelector("img");
        if (imgElement) {
            imgElement.src = img;
            imgElement.alt = obj.name;
        } else {
            imgElement = document.createElement("img");
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
    checkForLocationUpdate();
}

function makeMap(lat, lng) {
    const mapContainer = document.querySelector('.map-container'); 
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }
    const icon = L.icon({
        iconUrl: 'bilder/plats.svg',
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });

    if (!map) {
        map = L.map(mapContainer).setView([lat, lng], 14);
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

function setupFadeEffect() { //Faden för texten på infokortet
    const textContent = document.querySelector('.item__body');

    if (textContent) {
        textContent.addEventListener('scroll', function() {
            const scrollTop = textContent.scrollTop;
            const scrollHeight = textContent.scrollHeight;
            const offsetHeight = textContent.offsetHeight;

            const isAtBottom = scrollTop + offsetHeight >= scrollHeight - 1;

            const overlay = document.querySelector('.item__overlay');

            if (isAtBottom) {
                overlay.classList.add('scrolled-to-bottom');
            } else {
                overlay.classList.remove('scrolled-to-bottom');
            }
        });
    }
}