document.addEventListener("DOMContentLoaded", function() {
    fetchAllEstablishmentData();
    setupEventListeners();
    const savedActivities = JSON.parse(localStorage.getItem("savedActivity")) || [];
    localStorage.setItem("savedActivity", JSON.stringify(savedActivities));

    console.log("Loaded saved activities:", savedActivities);
});

let combinedData = []; // För att lagra all hämtad data
let map;
let marker;
let lat, lng;

async function fetchAllEstablishmentData() {
    const url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fel vid hämtning av data");

        const jsonData = await response.json();
        combinedData = jsonData.payload;

    } catch (error) {
        console.error("Fel vid hämtning:", error);
        document.getElementById("messageDisplay").textContent = "Kunde inte ladda data.";
    }
}

function setupEventListeners() {
    const searchInput = document.querySelector("#searchInput");
    const filterArrow = document.querySelector("#filterArrow");

    if (searchInput) {
        searchInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                performSearch(searchInput.value.trim().toLowerCase());
            }
        });
    }

    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            performSearch(searchInput.value.trim().toLowerCase());
        });
    }

    if (filterArrow) {
        filterArrow.addEventListener("click", function() {
            searchInput.value = "";
            updateListWithFilteredData([]);
        });
    }

    const modalClose = document.getElementById("modalClose");
    if (modalClose) {
        modalClose.addEventListener("click", function() {
            document.getElementById("modal").style.display = "none";
        });
    }
}
function toggleFavorite(activity, heartIcon) {
    let favorites = JSON.parse(localStorage.getItem("savedActivity")) || [];
    const index = favorites.findIndex(fav => fav.name === activity.name);

    if (index === -1) {
        
        const savedActivity = {
            name: activity.name,
            addedAt: new Date().toLocaleString() 
        };
        favorites.push(savedActivity);
        heartIcon.classList.add('favorited');
        heartIcon.classList.add('pulse');
        heartIcon.addEventListener('animationend', () => {
            heartIcon.classList.remove('pulse');
        }, { once: true });
    } else {
        // Tar bort aktivitet om den redan finns
        favorites.splice(index, 1);
        heartIcon.classList.remove('favorited');
        heartIcon.classList.remove('pulse');
        
    }

    localStorage.setItem("savedActivity", JSON.stringify(favorites));
}



function performSearch(query) {
    const allowedTypes = ["activity", "food", "attraction"];
    const excludedDescriptions = ["lekplats", "kyrka", "lekland", "hamburgerkedja", "golfbana"];

    const filteredData = combinedData.filter(item => {
        const matchesQuery = item.city?.toLowerCase().includes(query) ||
                             item.province?.toLowerCase().includes(query) ||
                             item.name?.toLowerCase().includes(query) ||
                             item.description?.toLowerCase().includes(query);

        const isTypeAllowed = allowedTypes.includes(item.type);
        const isDescriptionExcluded = !excludedDescriptions.some(desc => item.description?.toLowerCase().includes(desc));

        return matchesQuery && isTypeAllowed && isDescriptionExcluded;
    });

    updateListWithFilteredData(filteredData);
}
function getPriceImage(priceRange) {
    let price = extractPrice(priceRange);

    if (price >= 0 && price <= 25) {
        return "bilder/pris1.svg";
    } else if (price > 25 && price <= 100) {
        return "bilder/pris1.svg";
    } else if (price > 100 && price <= 250) {
        return "bilder/pris2.svg";
    } else if (price > 250 && price <= 500) {
        return "bilder/pris2.svg";
    } else if (price > 500) {
        return "bilder/pris3.svg";
    }

    return "bilder/logo.svg";  
}

function extractPrice(priceRange) {
    if (typeof priceRange === 'string') {
        let match = priceRange.match(/\d+/g); // Hittar alla siffror i strängen
        if (match) {
            return match.length > 1 ? (Number(match[0]) + Number(match[1])) / 2 : Number(match[0]);
        }
    }
    return NaN; 
}

function updateListWithFilteredData(filteredData) {
    const listUtf = document.getElementById("listUtf");
    if (!listUtf) {
        console.error("Elementet 'listUtf' hittades inte.");
        return;
    }

    listUtf.innerHTML = "";
    document.getElementById("messageDisplay").textContent = "";

    filteredData.forEach(item => {
        if (item) {
            const listItem = document.createElement("div");
            listItem.classList.add("list-item");

            const priceImageSrc = getPriceImage(item.price_range || ""); // Hämtar bild baserad på prisnivå

            listItem.innerHTML = `
                <h3>${item.name}</h3>
                <p class="itemDescr">${item.description || "Ingen beskrivning tillgänglig."}</p>
                <p class="itemLocPr">Plats: ${item.city || item.province}, Prisnivå: <img src="${priceImageSrc}" alt="Prisnivå" style="width:20px; height:30px; vertical-align: middle;"> </p>
                <div class="heart-icon"></div>
            `;
            const heartIcon = listItem.querySelector('.heart-icon');

            const favorites = JSON.parse(localStorage.getItem("savedActivity")) || [];
            const isFavorited = favorites.find(fav => fav.name === item.name);
            if (isFavorited) {
                heartIcon.classList.add('favorited');
            }

            heartIcon.addEventListener('click', function(event) {
                event.stopPropagation(); 
                toggleFavorite(item, heartIcon); 
            });
            listItem.appendChild(heartIcon);

            listItem.addEventListener("click", () => {
                updateImageContainer(item);
                openModal();
                updateMap(item.lat, item.lng);
                lat = item.lat;
                lng = item.lng;
            });

            listUtf.appendChild(listItem);
        }
    });
}

function updateImageContainer(item) {
    const imageContainer = document.querySelector(".image-container");
    const imgSrc = chooseImg(item.description);
    const imgElement = imageContainer.querySelector("img");
    if (imgElement) {
        imgElement.src = imgSrc;
        imgElement.alt = item.description;
    } else {
        const newImgElement = document.createElement("img");
        newImgElement.src = imgSrc;
        newImgElement.alt = item.description;
        imageContainer.appendChild(newImgElement);
    }
    

    document.getElementById("activity-type").textContent = `Typ av aktivitet: ${item.type || "Ej angiven"}`;
    document.getElementById("activity-city").textContent = `Stad: ${item.city || item.province || "Ej angiven"}`;

    const priceLevelContainer = document.getElementById("activity-price");
    priceLevelContainer.innerHTML = '';
    const priceLevelText = document.createTextNode(`Prisnivå: `); 
    priceLevelContainer.appendChild(priceLevelText);
    const priceImgElement = new Image(10, 20); 
    priceImgElement.src = getPriceImage(item.price_range || ""); 
    priceLevelContainer.appendChild(priceImgElement); 

    // Hantera rating med ikon
    const ratingContainer = document.getElementById("activity-rating");
    ratingContainer.innerHTML = '';  // Rensa befintligt innehåll

    const ratingText = document.createTextNode('Rating: ');
    ratingContainer.appendChild(ratingText);

    // stjärn ikon för rating
    const ratingImgElement = new Image(300, 20); 
    ratingImgElement.src = getRatingImage(item.rating || 0);
    ratingImgElement.alt = "Rating";
    ratingContainer.appendChild(ratingImgElement);

    document.getElementById("activity-abstract").textContent = `Beskrivning: ${item.abstract || "Ingen beskrivning tillgänglig."}`;
    document.getElementById("activity-reviews").textContent = `Recensioner: ${item.num_reviews || "Inga recensioner tillgängliga."}`;

    const websiteElement = document.getElementById("website");
    if (item.website) {
        websiteElement.innerHTML = `Websida: <a href="${item.website}" target="_blank">${item.website}</a>`;
    } else {
        websiteElement.textContent = "Ingen websida är tillgänglig.";
    }
}
function getRatingImage(rating) {
    const roundedRating = Math.round(rating * 2) / 2;
    let imageName = roundedRating.toString().replace('.', '');
    if (!imageName.includes('5')) {
        imageName = roundedRating.toString();
    }
    const imagePath = `bilder/${imageName}star.svg`;
    return imagePath;
}
function openModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "block";
    }
}

function updateMap(lat, lng) {
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

function chooseImg(description) {
    let a = ["Klippklättring"];
    let b = ["Simhall"];
    let c = ["Sevärdhet", "Fornlämning"];
    let d = ["Älgpark", "Djurpark", "Temapark"];
    let e = ["Glasbruk"];
    let f = ["Konstgalleri", "Ateljé", "Konsthall"];
    let g = ["Restaurang", "Bistro", "Pizzeria"];
    let h = ["Gatukök"];
    let i = ["Gokart"];
    let j = ["Zipline"];
    let k = ["Biograf"];
    let l = ["Cafe"];
    let m = ["Naturreservat"];
    let n = ["Paintballcenter"];
    let o = ["Nattklubb", "Bowlinghall", "Nöjescenter"];
    let p = ["Hälsocenter"];
    let q = ["Hembygdspark"];
    let r = ["Museum", "Slott"];

    let category;
    if (a.includes(description)) {
        category = "A";
    } else if (b.includes(description)) {
        category = "B";
    } else if (c.includes(description)) {
        category = "C";
    } else if (d.includes(description)) {
        category = "D";
    } else if (e.includes(description)) {
        category = "E";
    } else if (f.includes(description)) {
        category = "F";
    } else if (g.includes(description)) {
        category = "G";
    } else if (h.includes(description)) {
        category = "H";
    } else if (i.includes(description)) {
        category = "I";
    } else if (j.includes(description)) {
        category = "J";
    } else if (k.includes(description)) {
        category = "K";
    } else if (l.includes(description)) {
        category = "L";
    } else if (m.includes(description)) {
        category = "M";
    } else if (n.includes(description)) {
        category = "N";
    } else if (o.includes(description)) {
        category = "O";
    } else if (p.includes(description)) {
        category = "P";
    } else if (q.includes(description)) {
        category = "Q";
    } else if (r.includes(description)) {
        category = "R";
    } else {
        category = "Okänd kategori";
    }

    switch (category) {
        case "A":
            return "Foto/klippa.jpg";
        case "B":
            return "Foto/simhall.jpg";
        case "C":
            return "Foto/runsten.jpg";
        case "D":
            return "Foto/Djur.jpg";
        case "E":
            return "Foto/glaskonst.jpg";
        case "F":
            return "Foto/tavla.jpg";
        case "G":
            return "Foto/mat.jpg";
        case "H":
            return "Foto/gatukök.jpg";
        case "I":
            return "Foto/mållinje.jpg";
        case "J":
            return "Foto/träd.jpg";
        case "K":
            return "Foto/popcorn.jpg";
        case "L":
            return "Foto/bulle.jpg";
        case "M":
            return "Foto/stig.jpg";
        case "N":
            return "Foto/paintball.jpg";
        case "O":
            return "Foto/disco.jpg";
        case "P":
            return "Foto/hälsocenter.jpg";
        case "Q":
            return "Foto/hus.jpg";
        case "R":
            return "Foto/slott.jpg";
        default:
            return "bilder/logo.svg";
    }
}