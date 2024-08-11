let savedActivity;
let map;
let marker;

function init() {
    //Ladda aktiviteter från localStorage
    getData();

    //Gruppera aktiviteter efter datum
    const groupedActivities = groupActivitiesByDate(savedActivity);

    //Skapa en container för miniboxar
    const container = document.createElement("div");
    container.id = "activityContainer";

    //Skapa en minibox för varje grupp av aktiviteter
    groupedActivities.forEach((activities, date) => {
        createMiniboxForActivities(activities, date, container);
    });

    const main = document.querySelector("main");
    main.appendChild(container);

    openList();
}

window.addEventListener("DOMContentLoaded", init);

function ConNewDiv(activity, activityIndex, date) {
    const div = document.createElement("div");
    div.className = "testar";

    const name = document.createElement("h2");
    name.textContent = activity.name;
    div.appendChild(name);

    const dateElement = document.createElement("h3");
    dateElement.textContent = activity.addedAt;
    div.appendChild(dateElement);

    const pinImg = document.createElement("img");
    pinImg.src = "bilder/g4.png";
    pinImg.id = "häftstift";
    div.appendChild(pinImg);

    const heartIcon = document.createElement("img"); 
    heartIcon.className = "heart-icon";
    heartIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        toggleFavorite(activity, activityIndex, date);
    });
    div.appendChild(heartIcon);

    // Skapa och lägg till en img-tag för sopkorgsbilden
    const trash = document.createElement("img");
    trash.src = "bilder/soptunna.svg";
    trash.id = "tunna";
    trash.alt = "Soptunna";
    trash.addEventListener("click", () => {
        tabort(activityIndex, date, div);
    });
    div.appendChild(trash);

    div.addEventListener("click", function (event) {
        if (event.target !== trash && !activity.Title) {
            openModal(activity);
        }
    });

    return div;
}
function openModal(activity) {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "block"; // Visa modal

        updateImageContainer(activity);

        document.getElementById("activity-type").textContent = ` ${activity.name || "Ej angiven"}`;
        
        const cityElement = document.getElementById("activity-city");
        cityElement.innerHTML = `
        <div class="location-container">
        <img src="bilder/plats.svg" alt="Platsikon" class="location-icon"> ${activity.city || activity.province || "Ej angiven"}
        </div>
        `;

        const abstractContainer = document.getElementById("activity-abstract");
        abstractContainer.innerHTML = `
            <div class="information-container">
                <img src="bilder/information.svg" alt="Informationsikon" class="information-icon">
                ${activity.abstract || "Ingen beskrivning tillgänglig."}
            </div>
        `;

        const websiteElement = document.getElementById("website");
        if (activity.website) {
            websiteElement.innerHTML = `Websida: <a href="${activity.website}" target="_blank">${activity.website}</a>`;
        } else {
            websiteElement.textContent = "Ingen websida är tillgänglig.";
        }

        if (activity.lat !== undefined && activity.lng !== undefined) {
            updateMap(activity.lat, activity.lng); 
        } else {
            console.error('Lat or Lng is undefined:', activity);
        }

        displayReviews(activity.reviews || []); 
    }
}
//Stänga modal
function setupModalClose() {
    const modalClose = document.getElementById("modalClose");
    if (modalClose) {
        modalClose.addEventListener("click", function () {
            const modal = document.getElementById("modal");
            if (modal) {
                modal.style.display = "none"; 
            }
        });
    }
}

window.addEventListener("DOMContentLoaded", function() {
    setupModalClose();
});

function createMiniboxForActivities(activities, date, container) {

    const minibox = document.createElement("div");
    minibox.className = "minibox";

    const headerDiv = document.createElement("div");
    headerDiv.className = "head";

    const newH2 = document.createElement("h2");
    newH2.textContent = date;
    headerDiv.appendChild(newH2);

    //Skapar bilden med pilen 
    const pil = document.createElement("img");
    pil.src = "bilder/pils.svg";
    pil.className = "pil";
    pil.alt = "Pil";
    headerDiv.appendChild(pil);

    //Skapar bilden för soptunnan
    const soptunna = document.createElement("img");
    soptunna.src = "bilder/soptunna.svg";
    soptunna.className = "tunna";
    soptunna.alt = "Soptunna";
    headerDiv.appendChild(soptunna);

    //Gör så den går klicka på
    soptunna.addEventListener("click", () => {
        removeDateDiv(minibox, date);
    });

    // Skapa en div för att hålla alla aktivitetselement
    const activitiesDiv = document.createElement("div");
    activitiesDiv.style.display = "none"; 
    activitiesDiv.className = "activitiesDiv";

    activities.forEach((activity, index) => {
        const activityDiv = ConNewDiv(activity, index, date);
        activitiesDiv.appendChild(activityDiv);
    });

    minibox.appendChild(headerDiv);
    minibox.appendChild(activitiesDiv);

    container.appendChild(minibox);
}

function groupActivitiesByDate(activities) {
    const groupedActivities = new Map();

    //Gruppera aktiviteter efter datum
    activities.forEach((activity) => {
        const date = new Date(activity.addedAt).toLocaleDateString(); // Uppdaterat för att få datumet korrekt
        if (!groupedActivities.has(date)) {
            groupedActivities.set(date, []);
        }
        groupedActivities.get(date).push(activity);
    });
    return groupedActivities;
}

function openList() {
    //Gör så pilen fungerar
    document.querySelectorAll(".pil").forEach(img => {
        img.addEventListener("click", () => {
            const minibox = img.closest(".minibox");
            const activitiesDiv = minibox.querySelector(".activitiesDiv");
            if (activitiesDiv.style.display === "none") {
                img.classList.add("rotated");
                activitiesDiv.style.display = "block";
            } else {
                activitiesDiv.style.display = "none";
                img.classList.remove("rotated");
            }
        });
    });
}

function tabort(activityIndex, date, activityDiv) {
    // Visa dialogrutan
    const confirmBox = document.getElementById('confirmBox');
    confirmBox.showModal();

    // Stäng dialogrutan
    const closeModal = () => {
        confirmBox.close();
    };

    const confirmNo = document.getElementById('confirmNo');
    confirmNo.onclick = closeModal;

    // Hantera Ja-knappen
    const confirmYes = document.getElementById('confirmYes');
    confirmYes.onclick = function() {
        // Ta bort den specifika aktiviteten från savedActivity
        savedActivity = savedActivity.filter((activity, index) => {
            const activityDate = new Date(activity.addedAt).toLocaleDateString();
            return !(index === activityIndex && activityDate === date);
        });

        saveData();
        activityDiv.remove();

        // Stäng dialogrutan
        closeModal();
    };

    // Stäng dialogrutan om användaren klickar utanför rutan
    confirmBox.addEventListener('click', function(event) {
        if (event.target === confirmBox) {
            closeModal();
        }
    });
}

function removeDateDiv(minibox, date) {
    // Visa dialogrutan
    const confirmBox = document.getElementById('confirmBox');
    confirmBox.querySelector('p').textContent = "Är du säker på att du vill ta bort alla aktiviteter för detta datum?";
    confirmBox.showModal();

    // Stäng dialogrutan
    const closeModal = () => {
        confirmBox.close();
        confirmBox.querySelector('p').textContent = "Är du säker på att du vill ta bort denna aktivitet?";
    };

    const confirmNo = document.getElementById('confirmNo');
    confirmNo.onclick = closeModal;

    // Hantera Ja-knappen
    const confirmYes = document.getElementById('confirmYes');
    confirmYes.onclick = function() {
        // Ta bort alla aktiviteter för ett specifikt datum från savedActivity
        savedActivity = savedActivity.filter(activity => {
            const activityDate = new Date(activity.addedAt).toLocaleDateString();
            return activityDate !== date;
        });

        saveData();
        minibox.remove();

        // Stäng dialogrutan
        closeModal();
    };

    // Stäng dialogrutan om användaren klickar utanför rutan
    confirmBox.addEventListener('click', function(event) {
        if (event.target === confirmBox) {
            closeModal();
        }
    });
}

function saveData() {
    localStorage.setItem("savedActivity", JSON.stringify(savedActivity));
}

function getData() {
    savedActivity = JSON.parse(localStorage.getItem("savedActivity")) || [];
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
    
    // Uppdatera textinnehåll
    document.getElementById("activity-type").textContent = `Typ av aktivitet: ${item.type || "Ej angiven"}`;
    document.getElementById("activity-city").textContent = `Stad: ${item.city || item.province || "Ej angiven"}`;
    document.getElementById("activity-abstract").textContent = `Beskrivning: ${item.abstract || "Ingen beskrivning tillgänglig."}`;

    //  prisnivåbild
    updateImage("activity-price", 'Prisnivå: ', getPriceImage(item.price_range || ""));

    //  betygsbild
    updateImage("activity-rating", 'Rating: ', getRatingImage(item.rating || 0));

    //  webbplatslänk
    const websiteElement = document.getElementById("website");
    if (item.website) {
        websiteElement.innerHTML = `Websida: <a href="${item.website}" target="_blank">${item.website}</a>`;
    } else {
        websiteElement.textContent = "Ingen websida är tillgänglig.";
    }

    updateMap(item.lat, item.lng);

    fetchReviews(item.id).then(reviews => displayReviews(reviews)); 
}

//  uppdatera pris- och betygsbilder
function updateImage(containerId, textContent, imgSrc) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const textNode = document.createTextNode(textContent);
    container.appendChild(textNode);

    const imgElement = new Image(10, 20);
    imgElement.src = imgSrc;
    container.appendChild(imgElement);
}

function getPriceImage(priceRange) {
    let price = extractPrice(priceRange);

    if (price <= 100) {
        return "bilder/pris1.svg"; 
    } else if (price <= 500) {
        return "bilder/pris2.svg"; 
    } else if (price > 500) {
        return "bilder/pris3.svg"; 
    }

    return "bilder/logo.svg"; 
}

function extractPrice(priceRange) {
    if (typeof priceRange === 'string') {
        let match = priceRange.match(/\d+/g); 
        if (match) {
            return match.length > 1 ? (Number(match[0]) + Number(match[1])) / 2 : Number(match[0]);
        }
    }
    return NaN; 
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
    reviewsContainer.innerHTML = ''; 

    if (reviews.length === 0) {
        reviewsContainer.textContent = "Inga recensioner tillgängliga.";
        return;
    }

    
    const initialReviews = reviews.slice(0, 2);
    initialReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsContainer.appendChild(reviewElement);
    });

    if (reviews.length > 2) {
        const showMoreButton = document.createElement("button");
        showMoreButton.textContent = "Visa fler recensioner";
        showMoreButton.classList.add("show-more-button");

        const hideReviewsButton = document.createElement("button");
        hideReviewsButton.textContent = "Dölj recensioner";
        hideReviewsButton.classList.add("hide-reviews-button");
        hideReviewsButton.style.display = "none"; 

        showMoreButton.addEventListener("click", () => {

            const remainingReviews = reviews.slice(2);
            remainingReviews.forEach(review => {
                const reviewElement = createReviewElement(review);
                reviewsContainer.appendChild(reviewElement);
            });

            showMoreButton.style.display = "none";
            hideReviewsButton.style.display = "block";
            reviewsContainer.appendChild(hideReviewsButton);

        });

        hideReviewsButton.addEventListener("click", () => {

            reviewsContainer.innerHTML = '';
            initialReviews.forEach(review => {
                const reviewElement = createReviewElement(review);
                reviewsContainer.appendChild(reviewElement);
            });

            showMoreButton.style.display = "block";
            hideReviewsButton.style.display = "none";
            reviewsContainer.appendChild(showMoreButton);

            console.log("Endast de två första recensionerna visade, Visa fler recensioner-knappen synlig");
        });

        reviewsContainer.appendChild(showMoreButton);
        reviewsContainer.appendChild(hideReviewsButton); 
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