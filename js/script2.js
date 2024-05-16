document.addEventListener('DOMContentLoaded', async function() {
    const filterArrow = document.querySelector('.filter-arrow');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const activitiesDropdown = document.getElementById('activities');
    const foodDropdown = document.getElementById('food');
    const attractionDropdown = document.getElementById('attraktion');
    const locationDropdown = document.getElementById('places'); // Ny dropdown för plats
    const activitiesMenu = activitiesDropdown.querySelector('.nested-dropdown-menu');
    const foodMenu = foodDropdown.querySelector('.nested-dropdown-menu');
    const attractionMenu = attractionDropdown.querySelector('.nested-dropdown-menu');
    const locationMenu = locationDropdown.querySelector('.nested-dropdown-menu'); // Ny meny för plats
    const allDropdown = document.getElementById('all'); // Detta är elementet för "Alla"
    const dropdownMenus = document.querySelectorAll('.nested-dropdown-menu');
    const listUtf = document.getElementById('listUtf'); // Lista för att visa resultat
    const messageDisplay = document.getElementById('messageDisplay'); // Element för att visa meddelanden

    let combinedData = [];

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

    allDropdown.addEventListener('click', function() {
        activateAllItems();
        displayAllItems();
    });

    let selectedActivities = new Set();
    let selectedFoods = new Set();
    let selectedAttractions = new Set();
    let selectedLocations = new Set(); // Ny set för platser

    filterArrow.addEventListener('click', function(event) {
        event.preventDefault();
        dropdownMenu.classList.toggle('active');
    });

    activitiesDropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        activitiesMenu.classList.toggle('active');
        if (activitiesMenu.classList.contains('active')) {
            populateDropdownMenu(activitiesMenu, "activity", selectedActivities);
        }
        closeOtherMenus(activitiesMenu);
    });

    foodDropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        foodMenu.classList.toggle('active');
        if (foodMenu.classList.contains('active')) {
            populateDropdownMenu(foodMenu, "food", selectedFoods);
        }
        closeOtherMenus(foodMenu);
    });

    attractionDropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        attractionMenu.classList.toggle('active');
        if (attractionMenu.classList.contains('active')) {
            populateDropdownMenu(attractionMenu, "attraction", selectedAttractions);
        }
        closeOtherMenus(attractionMenu);
    });

    locationDropdown.addEventListener('click', function(event) { // Ny händelsehanterare för plats
        event.stopPropagation();
        locationMenu.classList.toggle('active');
        if (locationMenu.classList.contains('active')) {
            populateDropdownMenu(locationMenu, "location", selectedLocations);
        }
        closeOtherMenus(locationMenu);
    });

    document.addEventListener('click', function(event) {
        if (!activitiesDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
            activitiesMenu.classList.remove('active');
        }
        if (!foodDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
            foodMenu.classList.remove('active');
        }
        if (!attractionDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
            attractionMenu.classList.remove('active');
        }
        if (!locationDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) { // Stänger platsmeny
            locationMenu.classList.remove('active');
        }
    });

    activitiesMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    foodMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    attractionMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    locationMenu.addEventListener('click', function(event) { // Ny händelse för plats
        event.stopPropagation();
    });

    function closeOtherMenus(openedMenu) {
        if (openedMenu !== activitiesMenu) activitiesMenu.classList.remove('active');
        if (openedMenu !== foodMenu) foodMenu.classList.remove('active');
        if (openedMenu !== attractionMenu) attractionMenu.classList.remove('active');
        if (openedMenu !== locationMenu) locationMenu.classList.remove('active'); // Stänger platsmeny
    }

    function populateDropdownMenu(menu, type, selectedSet) {
        menu.innerHTML = ''; 

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
                const isTypeAllowed = allowedTypes.includes(item.type);
                const isDescriptionExcluded = excludedDescriptions.some(desc => item.description?.toLowerCase().includes(desc.toLowerCase()));

                if (isTypeAllowed && !isDescriptionExcluded && item.type === type) {
                    uniqueItems.add(item.description); 
                }
            }
        });

        // Sortera  objekt i alfabetisk ordning
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

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            menu.appendChild(checkboxContainer);

            if (selectedSet.has(item)) {
                checkbox.checked = true;
                checkboxContainer.classList.add('active-checkbox'); // Tillämpa aktiv klass för visuell feedback
            }

            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    selectedSet.add(this.value);
                    checkboxContainer.classList.add('active-checkbox'); // Tillämpa aktiv klass för visuell feedback
                } else {
                    selectedSet.delete(this.value);
                    checkboxContainer.classList.remove('active-checkbox'); // Ta bort aktiv klass för visuell feedback
                }
                console.log(`Selected ${type}s:`, Array.from(selectedSet));
                updateListDisplay(); 
            });
        });
    }

    function activateAllItems() {
        
        selectedActivities.clear();
        selectedFoods.clear();
        selectedAttractions.clear();
        selectedLocations.clear();

        combinedData.forEach(item => {
            if (item.type === 'activity') {
                selectedActivities.add(item.description);
            } else if (item.type === 'food') {
                selectedFoods.add(item.description);
            } else if (item.type === 'attraction') {
                selectedAttractions.add(item.description);
            }
            if (item.city) {
                selectedLocations.add(item.city);
            }
            if (item.province) {
                selectedLocations.add(item.province);
            }
        });

        updateDropdownItems(true);
        updateDropdownCheckboxes(activitiesMenu, selectedActivities);
        updateDropdownCheckboxes(foodMenu, selectedFoods);
        updateDropdownCheckboxes(attractionMenu, selectedAttractions);
        updateDropdownCheckboxes(locationMenu, selectedLocations);
    }
  

    function updateDropdownItems(isActive) {
        const dropdownItems = [activitiesDropdown, foodDropdown, attractionDropdown, locationDropdown];
        dropdownItems.forEach(item => {
            if (isActive) {
                item.classList.add('active-dropdown-item');
            } else {
                item.classList.remove('active-dropdown-item');
            }
        });
    }

    function updateDropdownCheckboxes(menu, selectedSet) {
        const checkboxes = menu.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectedSet.has(checkbox.value);
            const checkboxContainer = checkbox.parentElement;
            if (checkbox.checked) {
                checkboxContainer.classList.add('active-checkbox'); // Tillämpa aktiv klass för visuell feedback
            } else {
                checkboxContainer.classList.remove('active-checkbox'); // Ta bort aktiv klass för visuell feedback
            }
        });
    }

    function displayAllItems() {
        updateListDisplay(); 
    }

    function updateListDisplay() {
        const selectedItems = [...selectedActivities, ...selectedFoods, ...selectedAttractions, ...selectedLocations];
        console.log('Updating list display with selected items:', selectedItems);
        listUtf.innerHTML = ''; // Rensa befintliga listobjekt

        if (selectedItems.length === 0) {
            messageDisplay.textContent = "Inga resultat matchar dina val.";
        } else {
            const filteredData = combinedData.filter(item => {
                const matchesActivity = selectedActivities.size > 0 && item.type === 'activity' && selectedActivities.has(item.description);
                const matchesFood = selectedFoods.size > 0 && item.type === 'food' && selectedFoods.has(item.description);
                const matchesAttraction = selectedAttractions.size > 0 && item.type === 'attraction' && selectedAttractions.has(item.description);
                const matchesLocation = selectedLocations.size > 0 && (selectedLocations.has(item.city) || selectedLocations.has(item.province));

                return (matchesActivity || matchesFood || matchesAttraction) && (selectedLocations.size === 0 || matchesLocation);
            });
            console.log('Filtered data based on selections:', filteredData);

            if (filteredData.length === 0) {
                messageDisplay.textContent = "Inga resultat matchar dina val.";
            } else {
                messageDisplay.textContent = ''; 
                filteredData.forEach(item => {
                    const listItem = document.createElement('div');
                    listItem.classList.add('list-item');
                    listItem.innerHTML = `
                        <h3>${item.name}</h3>
                        <p>${item.description || "Ingen beskrivning tillgänglig."}</p>
                        <p>Plats: ${item.city || item.province}, Prisnivå: ${item.price_range || "ej angiven"}</p>
                    `;
                    listUtf.appendChild(listItem);
                });
            }
        }
    }
});