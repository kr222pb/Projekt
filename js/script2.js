
document.addEventListener('DOMContentLoaded', async function() {
    const filterArrow = document.querySelector('.filter-arrow');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const activitiesDropdown = document.getElementById('activities');
    const foodDropdown = document.getElementById('food');
    const attractionDropdown = document.getElementById('attraktion');
    const locationDropdown = document.getElementById('places');
    const allDropdown = document.getElementById('all');
    const homeEveningDropdown = document.getElementById('homeEvening');
    const listUtf = document.getElementById('listUtf');
    const messageDisplay = document.getElementById('messageDisplay');
    let allItemsActivated = false;
    let combinedData = [];
    let streamingData = {};
    let selectedActivities = new Set();
    let selectedFoods = new Set();
    let selectedAttractions = new Set();
    let selectedLocations = new Set();
    let selectedStreamingServices = new Set();
    let map;
    let marker;
    let lat;
    let lng;
    const savedActivities = JSON.parse(localStorage.getItem("savedActivity")) || [];
    localStorage.setItem("savedActivity", JSON.stringify(savedActivities));

    console.log("Loaded saved activities:", savedActivities);

    async function fetchAllEstablishmentData() {
        const url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Fel vid hämtning av data");
            const jsonData = await response.json();
            combinedData = jsonData.payload;
        } catch (error) {
            console.error("Fel vid hämtning:", error);
            messageDisplay.textContent = "Kunde inte ladda data.";
        }
    }

    async function fetchStreamingData() {
        const url = 'data/movie.json'; 
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Fel vid hämtning av data");
            streamingData = await response.json();
        } catch (error) {
            console.error("Fel vid hämtning:", error);
            messageDisplay.textContent = "Kunde inte ladda data.";
        }
    }

    await fetchAllEstablishmentData();
    await fetchStreamingData();
    function closeModal() {
        const modal = document.getElementById('modal');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
    
    function openModal() {
        const modal = document.getElementById('modal');
        if (modal.style.display !== 'block') {
            modal.style.display = 'block';
            closeAllDropdowns(); 
        }
    }
    function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
    const modalCloseButton = document.getElementById('modalClose');
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', closeModal);
    }
    listUtf.addEventListener('click', function(event) {
       
        let targetElement = event.target;

        while (targetElement != null && !targetElement.classList.contains('list-item')) {
            targetElement = targetElement.parentElement;
        }

        if (targetElement && !homeEveningDropdown.querySelector('.nested-dropdown-menu').contains(targetElement)) {
            if (!selectedStreamingServices.size) {
                openModal();
            }
        }
    });
    
    function toggleDropdown(dropdown, menu, selectedSet, type) {
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation();
            closeModal();
    
            const isActive = menu.classList.contains('active');
            closeOtherMenus(menu);
    
            if (!isActive) {
                menu.classList.add('active');
                populateDropdownMenu(menu, type, selectedSet);
            } else {
                menu.classList.remove('active');
            }
    
            
            if (type === "streaming" && isActive) {
                displayStreamingMovies(); 
            }
        });
    }
    function toggleFavorite(item, heartIcon) {
        let favorites = JSON.parse(localStorage.getItem("savedActivity")) || [];
        const index = favorites.findIndex(fav => fav.name === (item.name || item.Title));
    
        if (index === -1) {
           
            const savedItem = {
                name: item.name || item.Title,
                addedAt: new Date().toLocaleString()
            };
            favorites.push(savedItem);
            heartIcon.classList.add('favorited');
            heartIcon.classList.add('pulse');
            heartIcon.addEventListener('animationend', () => {
                heartIcon.classList.remove('pulse');
            }, { once: true });
        } else {
            favorites.splice(index, 1);
            heartIcon.classList.remove('favorited');
            heartIcon.classList.remove('pulse');
        }
    
        localStorage.setItem("savedActivity", JSON.stringify(favorites));
    }
    function closeOtherMenus(openedMenu) {
        const menus = document.querySelectorAll('.nested-dropdown-menu');
        menus.forEach(menu => {
            if (menu !== openedMenu) {
                menu.classList.remove('active');
            }
        });
    }

    toggleDropdown(activitiesDropdown, activitiesDropdown.querySelector('.nested-dropdown-menu'), selectedActivities, "activity");
    toggleDropdown(foodDropdown, foodDropdown.querySelector('.nested-dropdown-menu'), selectedFoods, "food");
    toggleDropdown(attractionDropdown, attractionDropdown.querySelector('.nested-dropdown-menu'), selectedAttractions, "attraction");
    toggleDropdown(locationDropdown, locationDropdown.querySelector('.nested-dropdown-menu'), selectedLocations, "location");
    toggleDropdown(homeEveningDropdown, homeEveningDropdown.querySelector('.nested-dropdown-menu'), selectedStreamingServices, "streaming");

    document.addEventListener('click', function(event) {
        [activitiesDropdown, foodDropdown, attractionDropdown, locationDropdown, homeEveningDropdown].forEach(dropdown => {
            const menu = dropdown.querySelector('.nested-dropdown-menu');
            if (!dropdown.contains(event.target)) {
                menu.classList.remove('active');
            }
        });
    });

    allDropdown.addEventListener('click', function() {
        allItemsActivated = !allItemsActivated;
        allItemsActivated ? activateAllItems() : deactivateAllItems();
        displayAllItems();
    });

    function populateDropdownMenu(menu, type, selectedSet) {
        menu.innerHTML = ''; 
        const includedDescriptions = ["Sevärdhet", "Fornlämning", "Temapark", "Konstgalleri", "Konsthall", "Restaurang", "Bistro", "Biograf", "Cafe", "Naturreservat", "Bowlinghall", "Nöjescenter", "Museum", "Slott"];
        
        const uniqueItems = new Set();

        if (type === "streaming") {
            Object.keys(streamingData).forEach(service => {
                uniqueItems.add(service);
            });
        } else {
            combinedData.forEach(item => {
                if (type === "location") {
                    const location = item.city || item.province;
                    if (location) {
                        uniqueItems.add(location);
                    }
                } else {
                    if (item.type === type && includedDescriptions.includes(item.description)) {
                        uniqueItems.add(item.description);
                    }
                }
            });
        }

        // Sorterar de unika platserna eller beskrivningarna
        const sortedItems = Array.from(uniqueItems).sort();

        sortedItems.forEach(item => {
            const checkboxContainer = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = item; 
            checkbox.name = `${type}-options`;
            checkbox.value = item;

            const label = document.createElement('label');
            label.htmlFor = item;
            label.textContent = item;

            checkbox.addEventListener('click', event => {
                event.stopPropagation();
            });

            label.addEventListener('click', event => {
                event.stopPropagation(); 
            });

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    selectedSet.add(item);
                    if (type === "streaming") {
                        displayStreamingMovies(item);
                    }
                } else {
                    selectedSet.delete(item);
                }
                if (type !== "streaming") {
                    updateListDisplay(); 
                }
            });

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            menu.appendChild(checkboxContainer);

            if (selectedSet.has(item)) {
                checkbox.checked = true;
            }
        });
    }

    function activateAllItems() {
        [selectedActivities, selectedFoods, selectedAttractions, selectedLocations, selectedStreamingServices].forEach(set => {
            set.clear();
            combinedData.forEach(item => {
                if (['activity', 'food', 'attraction'].includes(item.type)) {
                    set.add(item.description);
                }
                if (item.city) selectedLocations.add(item.city);
                if (item.province) selectedLocations.add(item.province);
            });
            Object.keys(streamingData).forEach(service => {
                selectedStreamingServices.add(service);
            });
        });
        updateCheckboxes();
    }

    function deactivateAllItems() {
        [selectedActivities, selectedFoods, selectedAttractions, selectedLocations, selectedStreamingServices].forEach(set => set.clear());
        updateCheckboxes();
    }

    function updateCheckboxes() {
        [activitiesDropdown, foodDropdown, attractionDropdown, locationDropdown, homeEveningDropdown].forEach(dropdown => {
            const menu = dropdown.querySelector('.nested-dropdown-menu');
            const set = dropdown === activitiesDropdown ? selectedActivities :
                       dropdown === foodDropdown ? selectedFoods :
                       dropdown === attractionDropdown ? selectedAttractions :
                       dropdown === locationDropdown ? selectedLocations : selectedStreamingServices;
            const checkboxes = menu.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = set.has(checkbox.value));
        });
    }

    function displayAllItems() {
        updateListDisplay();
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
            let match = priceRange.match(/\d+/g);
            if (match) {
                return match.length > 1 ? (Number(match[0]) + Number(match[1])) / 2 : Number(match[0]);
            }
        }
        return NaN; 
    }
    function updateListDisplay() {
        console.log("Updating the list display...");
        const includedDescriptions = ["Sevärdhet", "Fornlämning", "Temapark", "Konstgalleri", "Konsthall", "Restaurang", "Bistro", "Biograf", "Cafe", "Naturreservat", "Bowlinghall", "Nöjescenter", "Museum", "Slott"];
        
        const hasCategorySelected = selectedActivities.size > 0 || selectedFoods.size > 0 || selectedAttractions.size > 0 || selectedStreamingServices.size > 0;
        const hasLocationSelected = selectedLocations.size > 0;
    
        listUtf.innerHTML = '';
    
        if (!hasCategorySelected && !hasLocationSelected) {
            messageDisplay.textContent = "Inga resultat hittades.";
            return;
        }
    
        const filteredData = combinedData.filter(item => {
            const matchesActivity = selectedActivities.has(item.description) && item.type === 'activity';
            const matchesFood = selectedFoods.has(item.description) && item.type === 'food';
            const matchesAttraction = selectedAttractions.has(item.description) && item.type === 'attraction';
            const matchesLocation = selectedLocations.has(item.city) || selectedLocations.has(item.province);
    
            return includedDescriptions.includes(item.description) && 
                   ((hasCategorySelected ? (matchesActivity || matchesFood || matchesAttraction) : true) &&
                    (hasLocationSelected ? matchesLocation : true));
        });
    
        if (filteredData.length === 0) {
            messageDisplay.textContent = "Inga resultat hittades.";
        } else {
            messageDisplay.textContent = '';
            filteredData.forEach(item => {
                if (item) {
                    const listItem = document.createElement("div");
                    listItem.classList.add("list-item");
                    const priceImageSrc = getPriceImage(item.price_range || ""); 
    
                    listItem.innerHTML = `
                        <h3>${item.name}</h3>
                        <p class="itemDescr">${item.description || "Ingen beskrivning tillgänglig."}</p>
                        <p class="itemLocPr">Plats: ${item.city || item.province}, Prisnivå: <img src="${priceImageSrc}" alt="Prisnivå" style="width:20px; height:30px; vertical-align: middle;"> </p>
                        <div class="heart-icon"></div>
                    `;
                    const heartIcon = listItem.querySelector('.heart-icon');
    
                    // Kollar om aktiviteten redan finns i favoriter och uppdatera 
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
                        if (typeof item.lat !== 'undefined' && typeof item.lng !== 'undefined') {
                            updateImageContainer(item);
                            openModal();
                            updateMap(item.lat, item.lng);
                            lat = item.lat;
                            lng = item.lng;
    
                            // Uppdatera recensioner
                            updateReviews(item.id);; // Skickar ID  för att hämta recensioner
                        } else {
                            console.error("Invalid or missing coordinates.");
                        }
                    });
                    listUtf.appendChild(listItem);
                }
            });
        }
    }

    async function updateReviews(establishmentId) {
        const reviewsContainer = document.getElementById("activity-reviews");
        reviewsContainer.innerHTML = ""; // Tömmer tidigare recensioner
        
        const url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getreviews&id=${establishmentId}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Fel vid hämtning av recensioner");
            const data = await response.json();
            
            const reviews = data.payload;
            
            if (reviews.length === 0) {
                reviewsContainer.textContent = "Inga recensioner tillgängliga.";
                return;
            }
    
            reviews.forEach(review => {
                const reviewElement = document.createElement("div");
                reviewElement.classList.add("review");
    
                //  recensentens namn
                const name = document.createElement("p");
                name.classList.add("review-name");
                name.textContent = `Recensent: ${review.name || "Anonym"}`;
                reviewElement.appendChild(name);
    
                //  betyg
                const rating = document.createElement("p");
                rating.classList.add("review-rating");
                rating.textContent = `Betyg: ${review.rating}`;
                reviewElement.appendChild(rating);
    
                //  kommentar
                const comment = document.createElement("p");
                comment.classList.add("review-comment");
                comment.textContent = `Kommentar: ${review.comment || "Ingen kommentar."}`;
                reviewElement.appendChild(comment);
    
                //  datum
                const timestamp = document.createElement("p");
                timestamp.classList.add("review-date");
                timestamp.textContent = `Datum: ${review.relative_time}`;
                reviewElement.appendChild(timestamp);
    
                // Lägg till reviewElement i reviewsContainer
                reviewsContainer.appendChild(reviewElement);
            });
        } catch (error) {
            console.error("Fel vid hämtning av recensioner:", error);
            reviewsContainer.textContent = "Kunde inte ladda recensioner.";
        }
    }
    function displayStreamingMovies() {
        const selectedService = Array.from(selectedStreamingServices);
        if (selectedService.length > 0) {
            listUtf.innerHTML = ''; 
            selectedService.forEach(service => {
                streamingData[service].forEach(movie => {
                    const listItem = document.createElement('div');
                    listItem.classList.add('list-item');
                    listItem.innerHTML = `<h3>${movie.Title}</h3><p class="itemDescr">Kategori: ${movie.Category}</p><p class="itemLocPr">Längd: ${movie.Length} min, IMDB: ${movie.Stars}</p><div class="heart-icon"></div>`;
                    const heartIcon = listItem.querySelector('.heart-icon');
    
                    const favorites = JSON.parse(localStorage.getItem("savedActivity")) || [];
                    const isFavorited = favorites.find(fav => fav.name === movie.Title);
                    if (isFavorited) {
                        heartIcon.classList.add('favorited');
                    }
    
                    heartIcon.addEventListener('click', function(event) {
                        event.stopPropagation(); 
                        toggleFavorite(movie, heartIcon); 
                    });
    
                    listUtf.appendChild(listItem);
                });
            });
        }
    }

    //  dropdown-menyn när sidan laddas
    dropdownMenu.classList.add('active');
    filterArrow.addEventListener('click', function(event) {
        event.preventDefault();
        dropdownMenu.classList.toggle('active');
    });
});