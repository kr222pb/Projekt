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

    // Lägg till en händelsehanterare för att stänga modalen
    document.getElementById("modalClose").addEventListener("click", function() {
        document.getElementById("modal").style.display = "none";
    });
}

function filterByLocation(location) {
    const allowedTypes = ["activity", "food", "attraction"];
    const excludedDescriptions = ["Lekplats", "kyrka", "Lekland", "Hamburgerkedja","Golfbana"];

    const filteredData = combinedData.filter(item => {
        const isLocationSelected = (item.city && item.city.toLowerCase() === location) || (item.province && item.province.toLowerCase() === location);
        const isTypeAllowed = allowedTypes.includes(item.type);
        const isDescriptionExcluded = excludedDescriptions.some(desc => item.description?.toLowerCase().includes(desc.toLowerCase()));
        return isLocationSelected && isTypeAllowed && !isDescriptionExcluded;
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
            <p>${item.description || "Ingen beskrivning tillgänglig."}</p>
            <p>Plats: ${item.city || item.province}, Prisnivå: ${item.price_range || "ej angiven"}</p>
        `;
        listItem.addEventListener("click", () => openModal());
        listUtf.appendChild(listItem);
    });
}



function openModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "block";
    }
}

