
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
            closeAllDropdowns(); // Ensure all dropdowns are closed when the modal opens
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

        if (targetElement && targetElement.classList.contains('list-item')) {
            openModal();
        }
    });
    
    function toggleDropdown(dropdown, menu, selectedSet, type) {
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation();
            // This will close the modal if it's open when any dropdown is clicked
            closeModal();
    
            // Toggle the current menu's active state and close others
            const isActive = menu.classList.contains('active');
            closeOtherMenus(menu);
    
            if (!isActive) {
                menu.classList.add('active');
                populateDropdownMenu(menu, type, selectedSet);
            } else {
                menu.classList.remove('active');
            }
        });
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
        menu.innerHTML = ''; // Rensa innehållet varje gång menyn befolkas
        const allowedTypes = ["activity", "food", "attraction"];
        const excludedDescriptions = ["Lekplats", "kyrka", "Lekland", "Hamburgerkedja", "Hälsocenter", "Golfbana"];
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
                    if (allowedTypes.includes(item.type) && !excludedDescriptions.some(desc => item.description?.toLowerCase().includes(desc.toLowerCase()))) {
                        if (item.type === type) {
                            uniqueItems.add(item.description);
                        }
                    }
                }
            });
        }

        // Sortera de unika platserna eller beskrivningarna
        const sortedItems = Array.from(uniqueItems).sort();

        sortedItems.forEach(item => {
            const checkboxContainer = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = item; // Använd beskrivning eller plats som ID
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

    function updateListDisplay() {
        console.log("Updating the list display...");
        const allowedTypes = ["activity", "food", "attraction"];
        const excludedDescriptions = ["Playground", "church", "Playland", "Fast food chain", "Health center", "Golf course"];
    
        const hasCategorySelected = selectedActivities.size > 0 || selectedFoods.size > 0 || selectedAttractions.size > 0 || selectedStreamingServices.size > 0;
        const hasLocationSelected = selectedLocations.size > 0;
        console.log(`Categories selected: ${hasCategorySelected}, Locations selected: ${hasLocationSelected}`);
    
        listUtf.innerHTML = ''; 
    
        if (!hasCategorySelected && !hasLocationSelected) {
            messageDisplay.textContent = "No results match your selections.";
            return;
        }
   
        const filteredData = combinedData.filter(item => {
            const isTypeAllowed = allowedTypes.includes(item.type);
            const isDescriptionAllowed = !excludedDescriptions.some(desc => item.description?.toLowerCase().includes(desc.toLowerCase()));
            const matchesActivity = selectedActivities.has(item.description) && item.type === 'activity';
            const matchesFood = selectedFoods.has(item.description) && item.type === 'food';
            const matchesAttraction = selectedAttractions.has(item.description) && item.type === 'attraction';
            const matchesLocation = selectedLocations.has(item.city) || selectedLocations.has(item.province);
    
            return isTypeAllowed && isDescriptionAllowed && 
                   ((hasCategorySelected ? (matchesActivity || matchesFood || matchesAttraction) : true) &&
                    (hasLocationSelected ? matchesLocation : true));
        });
    
        
        if (filteredData.length === 0) {
            messageDisplay.textContent = "No results match your selections.";
        } else {
            messageDisplay.textContent = ''; 
            filteredData.forEach(item => {
                if (item) {
                    const listItem = document.createElement("div");
                    listItem.classList.add("list-item");
                    listItem.innerHTML = `
                        <h3>${item.name}</h3>
                        <p class="itemDescr">${item.description || "Ingen beskrivning tillgänglig."}</p>
                        <p class="itemLocPr">Plats: ${item.city || item.province}, Prisnivå: ${item.price_range || "ej angiven"}</p>
                    `;
                    listItem.addEventListener("click", () => {
                        if (typeof item.lat !== 'undefined' && typeof item.lng !== 'undefined') {
                            updateImageContainer(item);
                            openModal();
                            updateMap(item.lat, item.lng);
                            lat = item.lat;
                            lng = item.lng;
                        } else {
                            console.error("Invalid or missing coordinates for the selected item.");
                        }
                    });
                    listUtf.appendChild(listItem);
                }
            });
        }
    }

    function displayStreamingMovies(service) {
        const movies = streamingData[service];
        listUtf.innerHTML = ''; // Rensa listan
        movies.forEach(movie => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item');
            listItem.innerHTML = `<h3>${movie.Title}</h3><p class="itemDescr>Kategori: ${movie.Category}</p><p class="itemLocPr">Längd: ${movie.Length} min</p><p>Betyg: ${movie.Stars}</p>`;
            listUtf.appendChild(listItem);
        });
    }

    filterArrow.addEventListener('click', function(event) {
        event.preventDefault();
        dropdownMenu.classList.toggle('active');
    });
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
 
    
});