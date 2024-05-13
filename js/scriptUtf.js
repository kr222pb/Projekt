let combinedData = [];
let cityD = [];
let provinceD = [];

document.addEventListener("DOMContentLoaded", function() {
    fetchAllEstablishmentData();
    setupEventListeners();
});

async function fetchAllEstablishmentData() {
    const url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fel vid hämtning av data");

        const jsonData = await response.json();
        combinedData = jsonData.payload;

        // Filtrera och separera data baserat på stad och provins
        for (const item of combinedData) {
            if (item.city) {
                cityD.push(item);
            } else if (item.province) {
                provinceD.push(item);
            }
        }

        // Lägg till en specifik kontroll för Öland
        const olandData = combinedData.filter(item => item.province && item.province.toLowerCase() === "öland");
        console.log("Data för Öland:", olandData);

        showRandomItemsInList();
    } catch (error) {
        console.error("Fel vid hämtning:", error);
        document.getElementById("messageDisplay").textContent = "Kunde inte ladda data.";
    }
}

function setupEventListeners() {
    const searchInput = document.querySelector("#searchInput");
    if (searchInput) {
        searchInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                filterByLocation(searchInput.value.trim().toLowerCase());
            }
        });
    }

    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            filterByLocation(searchInput.value.trim().toLowerCase());
        });
    }
}

function filterByLocation(location) {
    const allowedTypes = ["activity", "food", "attraction"];
    const excludedDescriptions = ["Lekplats", "kyrka", "Lekland", "Hamburgerkedja"];

    const filteredData = combinedData.filter(item => {
        const isLocationSelected = (item.city && item.city.toLowerCase() === location) || (item.province && item.province.toLowerCase() === location);
        const isTypeAllowed = allowedTypes.includes(item.type);
        const isDescriptionExcluded = excludedDescriptions.some(desc => item.description?.toLowerCase().includes(desc.toLowerCase()));
        return isLocationSelected && isTypeAllowed && !isDescriptionExcluded;
    });

    if (filteredData.length === 0) {
        showRandomItemsInList(); // Visa slumpmässiga objekt om inga resultat hittades
    } else {
        updateListWithFilteredData(filteredData);
    }
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
            <p>${item.description || "Ingen beskrivning tillgänglig."}</p>
            <p>Plats: ${item.city || item.province}, Prisnivå: ${item.price_range || "ej angiven"}</p>
        `;
        listUtf.appendChild(listItem);
    });
}

function showRandomItemsInList() {
    const listUtf = document.getElementById("listUtf");
    if (!listUtf) {
        console.error("Elementet 'listUtf' hittades inte.");
        return;
    }

    const allowedTypes = ["activity", "food", "attraction"];
    const excludedDescriptions = ["Lekplats", "kyrka", "Lekland", "Hamburgerkedja"];

    
    const validData = combinedData.filter(item => {
        const isTypeAllowed = allowedTypes.includes(item.type);
        const isDescriptionExcluded = excludedDescriptions.some(desc => item.description?.toLowerCase().includes(desc.toLowerCase()));
        return isTypeAllowed && !isDescriptionExcluded;
    });

    listUtf.innerHTML = ""; // Rensa befintligt innehåll

    const randomIndexes = [];
    while (randomIndexes.length < 10 && randomIndexes.length < validData.length) {
        const randomIndex = Math.floor(Math.random() * validData.length);
        if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
        }
    }

    randomIndexes.forEach(index => {
        const item = validData[index];
        const listItem = document.createElement("div");
        listItem.classList.add("list-item");
        listItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Plats: ${item.city || item.province}
            </br> Pris: ${item.price_range}</p>
        `;
        listUtf.appendChild(listItem);
    });
}