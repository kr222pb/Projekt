document.addEventListener("DOMContentLoaded", function() {
    fetchAllEstablishmentData();
    setupEventListeners();
});

let combinedData = []; // För att lagra all hämtad data
let map;
let marker;

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
            searchInput.value = ""; // Rensa sökfält
            updateListWithFilteredData([]); // Rensa listan
        });
    }

    document.getElementById("modalClose").addEventListener("click", function() {
        document.getElementById("modal").style.display = "none";
    });
}

function performSearch(query) {
    const allowedTypes = ["activity", "food", "attraction"];
    const excludedDescriptions = ["Lekplats", "kyrka", "Lekland", "Hamburgerkedja", "Golfbana"];

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

function updateListWithFilteredData(filteredData) {
    const listUtf = document.getElementById("listUtf");
    if (!listUtf) {
        console.error("Elementet 'listUtf' hittades inte.");
        return;
    }

    listUtf.innerHTML = ""; // Rensa tidigare resultat
    document.getElementById("messageDisplay").textContent = ""; // Rensa tidigare meddelanden

    filteredData.forEach(item => {
        const listItem = document.createElement("div");
        listItem.classList.add("list-item");
        listItem.innerHTML = `
            <h3>${item.name}</h3>
            <p class="itemDescr">${item.description || "Ingen beskrivning tillgänglig."}</p>
            <p class="itemLocPr">Plats: ${item.city || item.province}, Prisnivå: ${item.price_range || "ej angiven"}</p>
        `;
        listItem.addEventListener("click", () => {
            openModal();
            updateMap(item.lat, item.lng); 
        });
        listUtf.appendChild(listItem);
    });
}

function openModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "block";
    }
}

function updateMap(lat, lng) {
    if (lat === undefined || lng === undefined) {
        console.error("Invalid coordinates:", lat, lng);
        return;
    }

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = ""; // Clear previous map content
    }

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