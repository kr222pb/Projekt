document.addEventListener('DOMContentLoaded', function() {
    const filterTrigger = document.querySelector(".filter-trigger");
    const tabsContainer = document.querySelector(".scrollable-tabs-container");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");

    tabsContainer.classList.add("active");
    filterTrigger.classList.add("active");
    
    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault(); 
            this.classList.toggle("active");
            const stad = this.getAttribute('data-stad');
            const provins = this.getAttribute('data-provins');

            // Anropa filterAndShow med lämpligt argument
            if (stad) {
                filterAndShow(stad);
            } else if (provins) {
                filterAndShow(provins);
            }
        });
    });

    // gömmer vänster pil
    leftArrow.style.display = 'none';

    // Toggla dropdown vid klick på 'Filtrera'
    filterTrigger.addEventListener("click", function() {
        tabsContainer.classList.toggle("active");
        filterTrigger.classList.toggle("active");
    });

    //skrollning åt höger
    rightArrow.addEventListener("click", function() {
        navMenu.scrollBy({ left: 100, behavior: 'smooth' });
    });

    //skrollning åt vänster
    leftArrow.addEventListener("click", function() {
        navMenu.scrollBy({ left: -100, behavior: 'smooth' });
    });

    // kontrollera pilarnas synlighet
    navMenu.addEventListener('scroll', function() {
        const maxScrollLeft = navMenu.scrollWidth - navMenu.clientWidth;

        if (navMenu.scrollLeft > 0) {
            leftArrow.style.display = 'flex'; 
        } else {
            leftArrow.style.display = 'none'; 
        }

        if (navMenu.scrollLeft < maxScrollLeft) {
            rightArrow.style.display = 'flex'; 
        } else {
            rightArrow.style.display = 'none'; 
        }
    });
    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault(); 
            this.classList.toggle("active"); 
        });
    });
});

function toggleInfo() {
    var infoPanel = document.getElementById("infoPanel");
    if (infoPanel.style.transform === "translateY(0%)") {
        infoPanel.style.transform = "translateY(100%)"; // Dölj panelen
    } else {
        infoPanel.style.transform = "translateY(0%)"; // Visa panelen
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const infoButton = document.getElementById("info");
    // Initiera dold informationspanel vid laddning
    const infoPanel = document.getElementById("infoPanel");
    infoPanel.style.transform = "translateY(100%)"; // Dölj panelen

    // Eventlyssnare för att visa/dölja informationspanelen
    infoButton.addEventListener('click', toggleInfo);
});
