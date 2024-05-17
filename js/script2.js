document.addEventListener('DOMContentLoaded', async function() {
    const filterArrow = document.querySelector('.filter-arrow');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const activitiesDropdown = document.getElementById('activities');
    const foodDropdown = document.getElementById('food');
    const attractionDropdown = document.getElementById('attraktion');
    const locationDropdown = document.getElementById('places');
    const allDropdown = document.getElementById('all');
    const listUtf = document.getElementById('listUtf');
    const messageDisplay = document.getElementById('messageDisplay');
    let allItemsActivated = false;
    let combinedData = [];
    let selectedActivities = new Set();
    let selectedFoods = new Set();
    let selectedAttractions = new Set();
    let selectedLocations = new Set();

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

    await fetchAllEstablishmentData();

    function toggleDropdown(dropdown, menu, selectedSet, type) {
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation();
            menu.classList.toggle('active');
            if (menu.classList.contains('active')) {
                populateDropdownMenu(menu, type, selectedSet);
            }
            closeOtherMenus(menu);
        });
    }

    function closeOtherMenus(openedMenu) {
        [activitiesDropdown, foodDropdown, attractionDropdown, locationDropdown].forEach(dropdown => {
            const menu = dropdown.querySelector('.nested-dropdown-menu');
            if (menu !== openedMenu) {
                menu.classList.remove('active');
            }
        });
    }

    toggleDropdown(activitiesDropdown, activitiesDropdown.querySelector('.nested-dropdown-menu'), selectedActivities, "activity");
    toggleDropdown(foodDropdown, foodDropdown.querySelector('.nested-dropdown-menu'), selectedFoods, "food");
    toggleDropdown(attractionDropdown, attractionDropdown.querySelector('.nested-dropdown-menu'), selectedAttractions, "attraction");
    toggleDropdown(locationDropdown, locationDropdown.querySelector('.nested-dropdown-menu'), selectedLocations, "location");

    document.addEventListener('click', function(event) {
        [activitiesDropdown, foodDropdown, attractionDropdown, locationDropdown].forEach(dropdown => {
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
                event.stopPropagation(); // Förhindra att eventet bubblar upp när etiketten klickas
            });
    
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    selectedSet.add(item);
                } else {
                    selectedSet.delete(item);
                }
                updateListDisplay(); // Uppdatera listan med de valda elementen
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
        [selectedActivities, selectedFoods, selectedAttractions, selectedLocations].forEach(set => {
            set.clear();
            combinedData.forEach(item => {
                if (['activity', 'food', 'attraction'].includes(item.type)) {
                    set.add(item.description);
                }
                if (item.city) selectedLocations.add(item.city);
                if (item.province) selectedLocations.add(item.province);
            });
        });
        updateCheckboxes();
    }

    function deactivateAllItems() {
        [selectedActivities, selectedFoods, selectedAttractions, selectedLocations].forEach(set => set.clear());
        updateCheckboxes();
    }

    function updateCheckboxes() {
        [activitiesDropdown, foodDropdown, attractionDropdown, locationDropdown].forEach(dropdown => {
            const menu = dropdown.querySelector('.nested-dropdown-menu');
            const set = dropdown === activitiesDropdown ? selectedActivities :
                       dropdown === foodDropdown ? selectedFoods :
                       dropdown === attractionDropdown ? selectedAttractions : selectedLocations;
            const checkboxes = menu.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = set.has(checkbox.value));
        });
    }

    function displayAllItems() {
        updateListDisplay();
    }

    function updateListDisplay() {
        console.log("Uppdaterar visningen av listan...");
        const allowedTypes = ["activity", "food", "attraction"];
        const excludedDescriptions = ["Lekplats", "kyrka", "Lekland", "Hamburgerkedja", "Hälsocenter", "Golfbana"];
    
        const hasCategorySelected = selectedActivities.size > 0 || selectedFoods.size > 0 || selectedAttractions.size > 0;
        const hasLocationSelected = selectedLocations.size > 0;
        console.log(`Kategorier valda: ${hasCategorySelected}, Platser valda: ${hasLocationSelected}`);
    
        listUtf.innerHTML = ''; // Rensa listan
    
        // Om inga kategorier eller platser är valda, visa meddelande
        if (!hasCategorySelected && !hasLocationSelected) {
            messageDisplay.textContent = "Inga resultat matchar dina val.";
            return;
        }
    
        // Filtrera data baserat på valda kriterier
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
    
        // Hantera om inga data passar filtreringen
        if (filteredData.length === 0) {
            messageDisplay.textContent = "Inga resultat matchar dina val.";
        } else {
            messageDisplay.textContent = ''; // Rensa tidigare meddelanden
            filteredData.forEach(item => {
                const listItem = document.createElement('div');
                listItem.classList.add('list-item');
                listItem.innerHTML = `<h3>${item.name}</h3><p>${item.description || "Ingen beskrivning tillgänglig."}</p><p>Plats: ${item.city || item.province}, Prisnivå: ${item.price_range || "ej angiven"}</p>`;
                listUtf.appendChild(listItem);
            });
        }
    }
    filterArrow.addEventListener('click', function(event) {
        event.preventDefault();
        dropdownMenu.classList.toggle('active');
    });
});