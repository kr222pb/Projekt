function init() {
    fetchSMAPI()
}

window.addEventListener("load", init)

async function fetchSMAPI() {
    //URLer
    let aktivitet = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getall&descriptions=Temapark,Nöjespark,Älgpark,Djurpark,Simhall,Gokart,Zipline,Nöjescenter,Klippklättring,Paintballcenter, Hälsocenter,Golfbana,Bowlinghall,Nattklubb"

    let mat = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getall&descriptions=Restaurang,Pizzeria,Gatukök,Bistro,Cafe"

    let attraction = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=attraction&method=getall&descriptions=Museum,Slott,Konstgalleri,Ateljé,Glasbruk,Konsthall,Sevärdhet,Fornlämning,Hembygdspark,Naturreservat"
    // Hämta data från SMAPI
    let response = await fetch(attraction)

    // Kontrollera om begäran var framgångsrik
    if (response.ok) {
        console.log("Banan")
        // Konvertera den hämtade JSON-datamängden till ett JavaScript-objekt
        let data = await response.json()
        // Skicka den konverterade datan till funktionen readSMAPI
        readSMAPI(data)
    }
    else {
        // Hantera fel om begäran inte var framgångsrik
        console.log("Fel vid hämtning:", response.status)
    }

}

function readSMAPI(data) {
    let HTMLCode = ""
    // Iterera över datan och logga namnet på varje objekt
    for (let x = 0; x < data.payload.length; x++) {
        let obj = data.payload[x]
        console.log(obj.description)

        HTMLCode = "<h2>"+obj.name+"</h2>"
       // HTMLCode += "<h2>"+obj.description+"</h2>"
          let h2 = document.querySelector(".container h2")
    h2.innerHTML = HTMLCode
    }
  
}
document.addEventListener('DOMContentLoaded', function() {
    const filterTrigger = document.querySelector(".filter-trigger");
    const tabsContainer = document.querySelector(".scrollable-tabs-container");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");


    // gömmer vänster pil
    leftArrow.style.display = 'none';

    // Toggla dropdown vid klick på 'Filtrera'
    filterTrigger.addEventListener("click", function() {
        tabsContainer.classList.toggle("active");
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
            leftArrow.style.display = 'flex'; // Visar vänster pil när användaren har scrollat
        } else {
            leftArrow.style.display = 'none'; // Gömer vänster pil när användaren är helt till vänster
        }

        if (navMenu.scrollLeft < maxScrollLeft) {
            rightArrow.style.display = 'flex'; // Visar höger pil om det finns innehåll att skrolla till
        } else {
            rightArrow.style.display = 'none'; // Göm höger pil när användaren har nått slutet
        }
    });
    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Förhindrar att sidan navigerar
            this.classList.toggle("active"); 
        });
    });
});