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

    const priceRangeInput = document.getElementById("priceRange");
    if (priceRangeInput) {
        priceRangeInput.addEventListener("change", function() {
            filterByPriceRange(priceRangeInput.value);
        });
    }
}

function filterByPriceRange(priceRange) {
    const [minPrice, maxPrice] = priceRange.split('-').map(price => (price === "+" ? Infinity : Number(price)));

    const includedDescriptions = [ "Restaurang", "Bistro", "Biograf", "Cafe", "Naturreservat", "Bowlinghall", "Nöjescenter", "Museum", "Slott"];
    const allowedTypes = ["activity", "food", "attraction"];

    const filteredData = combinedData.filter(item => {
        const price = extractPrice(item.price_range);
        const isTypeAllowed = allowedTypes.includes(item.type);
        const isDescriptionIncluded = includedDescriptions.includes(item.description);
        return price >= minPrice && price <= maxPrice && isTypeAllowed && isDescriptionIncluded;
    });
    updateListWithFilteredData(filteredData, minPrice, maxPrice);
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

function performSearch(query) {
    const includedDescriptions = ["Sevärdhet", "Fornlämning", "Temapark", "Konstgalleri", "Konsthall", "Restaurang", "Bistro", "Biograf", "Cafe", "Naturreservat", "Bowlinghall", "Nöjescenter", "Museum", "Slott"];
    const allowedTypes = ["activity", "food", "attraction"];

    const filteredData = combinedData.filter(item => {
        const matchesQuery = item.city?.toLowerCase().includes(query) ||
                             item.province?.toLowerCase().includes(query) ||
                             item.name?.toLowerCase().includes(query) ||
                             item.description?.toLowerCase().includes(query);

        const isTypeAllowed = allowedTypes.includes(item.type);
        const isDescriptionIncluded = includedDescriptions.includes(item.description);

        return matchesQuery && isTypeAllowed && isDescriptionIncluded;
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

function updateListWithFilteredData(filteredData, minPrice, maxPrice) {
    const listUtf = document.getElementById("listUtf");
    if (!listUtf) {
        console.error("Elementet 'listUtf' hittades inte.");
        return;
    }

    listUtf.innerHTML = "";
    const messageDisplay = document.getElementById("messageDisplay");
    messageDisplay.textContent = "";

    if (filteredData.length === 0) {
        messageDisplay.textContent = "Inga resultat hittades.";
        return;
    }

    filteredData.forEach(item => {
        if (item) {
            const listItem = document.createElement("div");
            listItem.classList.add("list-item");

            const priceImageSrc = getPriceImage(item.price_range || "");

            listItem.innerHTML = `
                <h3>${item.name}</h3>
                <p class="itemDescr">${item.description || "Ingen beskrivning tillgänglig."}</p>
                <p class="itemLocPr">Plats: ${item.city || item.province}, Prisnivå: <img src="${priceImageSrc}" alt="Prisnivå" style="width:20px; height:30px; vertical-align: middle;"></p>
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

            listItem.addEventListener("click", async () => {
                await updateEstablishmentDetails(item.id);
                openModal();
                updateMap(item.lat, item.lng);
                lat = item.lat;
                lng = item.lng;
            });

            listUtf.appendChild(listItem);
        }
    });
}

function toggleFavorite(activity, heartIcon) {
    let favorites = JSON.parse(localStorage.getItem("savedActivity")) || [];
    const index = favorites.findIndex(fav => fav.name === activity.name);

    if (index === -1) {
        const savedActivity = {
            name: activity.name,
            addedAt: new Date().toLocaleString(),
            description: activity.description || "Ingen beskrivning tillgänglig.",
            type: activity.type || "Ej angiven",
            city: activity.city || activity.province || "Ej angiven",
            price_range: activity.price_range || "Ej angiven",
            rating: activity.rating || 0,
            abstract: activity.abstract || "Ingen beskrivning tillgänglig.",
            website: activity.website || "Ingen websida är tillgänglig.",
            id: activity.id,
            lat: activity.lat,
            lng: activity.lng
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

async function updateEstablishmentDetails(establishmentId) {
    try {
        const establishment = combinedData.find(est => est.id === establishmentId);
        if (!establishment) throw new Error("Etablering ej hittad");

        updateImageContainer(establishment);

        const reviews = await fetchReviews(establishmentId);
        displayReviews(reviews);

    } catch (error) {
        console.error("Fel vid uppdatering av etableringsdetaljer:", error);
        document.getElementById("messageDisplay").textContent = "Kunde inte uppdatera detaljer.";
    }
}

async function fetchReviews(establishmentId) {
    const url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getreviews&id=${establishmentId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fel vid hämtning av recensioner");

        const jsonData = await response.json();
        return jsonData.payload || [];
    } catch (error) {
        console.error("Fel vid hämtning av recensioner:", error);
        return [];
    }
}

function displayReviews(reviews) {
    const reviewsContainer = document.getElementById("activity-reviews");
    reviewsContainer.innerHTML = ''; // Rensa befintligt innehåll

    if (reviews.length === 0) {
        reviewsContainer.textContent = "Inga recensioner tillgängliga.";
        return;
    }

    // Visa de två första recensionerna
    const initialReviews = reviews.slice(0, 2);
    initialReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsContainer.appendChild(reviewElement);
    });

    // Visa knappen för att ladda fler om det finns fler än två recensioner
    if (reviews.length > 2) {
        const showMoreButton = document.createElement("button");
        showMoreButton.textContent = "Visa fler recensioner";
        showMoreButton.classList.add("show-more-button");

        const hideReviewsButton = document.createElement("button");
        hideReviewsButton.textContent = "Dölj recensioner";
        hideReviewsButton.classList.add("hide-reviews-button");
        hideReviewsButton.style.display = "none"; // Göm knappen initialt

        showMoreButton.addEventListener("click", () => {

            // Visa resterande recensioner
            const remainingReviews = reviews.slice(2);
            remainingReviews.forEach(review => {
                const reviewElement = createReviewElement(review);
                reviewsContainer.appendChild(reviewElement);
            });

            // Visa knappen för att dölja recensioner och placera den sist
            showMoreButton.style.display = "none";
            hideReviewsButton.style.display = "block";
            reviewsContainer.appendChild(hideReviewsButton);

        });

        hideReviewsButton.addEventListener("click", () => {

            // Dölj alla recensioner utom de första två
            reviewsContainer.innerHTML = '';
            initialReviews.forEach(review => {
                const reviewElement = createReviewElement(review);
                reviewsContainer.appendChild(reviewElement);
            });

            // Visa knappen för att visa fler recensioner och göm dölja-knappen
            showMoreButton.style.display = "block";
            hideReviewsButton.style.display = "none";
            reviewsContainer.appendChild(showMoreButton);

            console.log("Endast de två första recensionerna visade, Visa fler recensioner-knappen synlig");
        });

        reviewsContainer.appendChild(showMoreButton);
        reviewsContainer.appendChild(hideReviewsButton); // Lägg till dölja-knappen 
    }
}

function createReviewElement(review) {
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review");

    const name = document.createElement("p");
    name.classList.add("review-name");
    name.textContent = `Recensent: ${review.name || "Anonym"}`;
    reviewElement.appendChild(name);

    const rating = document.createElement("p");
    rating.classList.add("review-rating");
    rating.textContent = `Betyg: ${review.rating}`;
    reviewElement.appendChild(rating);

    const comment = document.createElement("p");
    comment.classList.add("review-comment");
    comment.textContent = `Kommentar: ${review.comment || "Ingen kommentar."}`;
    reviewElement.appendChild(comment);

    const timestamp = document.createElement("p");
    timestamp.classList.add("review-date");
    timestamp.textContent = `Datum: ${review.relative_time}`;
    reviewElement.appendChild(timestamp);

    return reviewElement;
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
    
    document.getElementById("activity-type").textContent = ` ${item.name || "Ej angiven"}`;
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