document.addEventListener("DOMContentLoaded", init);

let formElem;
let ananas;
let mattyp;
let alkohol = "";
let uteservering = "";
let attraktion;
let city;
let typ;
let activityType;
let fysiskt;
let disability = ""; // Initialisera med tom sträng
let lat = "";
let lng = "";

function init() {
    ananas = document.querySelector("#ananas");
    formElem = document.querySelector("#form");
    formElem.addEventListener('change', readValue);
}

function readValue() {
    city = formElem.city.value;
    typ = formElem.typ.value;

    if (typ === "" || city === "") {
        ananas.style.display = "none";
    } else {
        ananas.style.display = "block";
    }

    // Set latitude and longitude based on city
    switch (city) {
        case "Växjö":
            lat = "56.8767";
            lng = "14.8039";
            break;
        case "Kalmar":
            lat = "56.6616";
            lng = "16.3600";
            break;
        case "Karlskrona":
            lat = "56.1663";
            lng = "15.5851";
            break;
        case "Värnamo":
            lat = "57.18631";
            lng = "14.03626";
            break;
        case "Alvesta":
            lat = "56.8991";
            lng = "14.5565";
            break;
        case "Oskarshamn":
            lat = "57.2626";
            lng = "16.4574";
            break;
        case "Vimmerby":
            lat = "57.6632";
            lng = "15.8582";
            break;
        case "Jönköping":
            lat = "57.7849";
            lng = "14.1632";
            break;
        case "Öland":
            lat = "56.6517";
            lng = "16.4723";
            break;
        default:
            lat = "";
            lng = "";
            break;
    }

    extraInfo(); 
}

function extraInfo() {
    let extra = "";
    if (typ === "Food") {
        ananas.style.display = "block";
        extra = `
            <h2>Mattyp:</h2>
            <div class="boder">
                <button class="mattyp" value="PIZZERIA">Pizza</button>
                <button class="mattyp" value="A_LA_CARTE">A LA CARTE</button>
                <button class="mattyp" value="cafe">Café</button>
                <button class="mattyp" value="buffe">Buffé</button>
                <button class="mattyp" value="take_out">Ta med</button>
            </div>
            <h2>Alkohol:</h2>
            <div class="boder">
                <button class="alkohol" value="Y">Ja</button>
                <button class="alkohol" value="N">Nej</button>
            </div>
            <h2>Uteservering:</h2>
            <div class="boder">
                <button class="uteservering" value="Y">Ja</button>
                <button class="uteservering" value="N">Nej</button>
            </div>
        `;
    } else if (typ === "attraction") {
        ananas.style.display = "block";
        extra = `
            <div class="boder">
                <h2>Typ:</h2>
                <button class="attractionType" value="konstgalleri,atteljé,konsthall">Konst</button>
                <button class="attractionType" value="Museum">Museum</button>
                <button class="attractionType" value="Slott">Slott</button>
                <button class="attractionType" value="Glasbruk">Glasbruk</button>
                <button class="attractionType" value="sevärdhet">Sevärdhet</button>
            </div>
        `;
    } else {
        ananas.style.display = "block";
        extra = `
            <h2>Aktivitet:</h2>
            <div class="boder">
                <button class="activityType" value="Temapark,nöjespark,älgpark,nöjescenter">Roliga parker</button>
                <button class="activityType" value="Simhall">Simhall</button>
                <button class="activityType" value="Gokart">Gokart</button>
                <button class="activityType" value="Paintballcenter">Paintball</button>
                <button class="activityType" value="Bowlinghall">Bowling</button>
                <button class="activityType" value="skateboardpark">skateboardpark</button>
                <button class="activityType" value="Nattklubb">Nattklubb</button>
                <button class="activityType" value="Biograf">Bio</button>
            </div>
            <h2>Fysiskt krävande:</h2>
            <button id="infoBtn">Info</button>
            <div id="INFO" style="display:none;">
                <p>De nivåer som finns tillgängliga är; LOW, MEDIUM och HIGH. Aktiviteter med ansträngningsnivå LOW i huvudsak "sittande" aktiviteter där utövaren inte löper någon risk för fysisk utmattning. Aktiviteter med ansträngningsnivå MEDIUM är aktiviteter där utövaren förväntas röra på sig, men utan någon direkt ansträngning och låg risk för fysisk utmattning. Aktiviteter med ansträngningsnivå HIGH är aktiviteter där utövaren utsätts för fysiska påfrestningar och därmed en hög risk för fysisk utmattning.</p>
            </div>
            <div class="boder">
                <button class="fysiskt" value="LOW">Low</button>
                <button class="fysiskt" value="MEDIUM">Medium</button>
                <button class="fysiskt" value="HIGH">High</button>
            </div>
            <h2>Handikappsanpassat:</h2>
            <div class="boder">
                <button class="disability" value="Y">Ja</button>
                <button class="disability" value="N">Nej</button>
            </div>
        `;
    }
    ananas.innerHTML = extra;
    addEventListeners(); // Lägg till eventlyssnare efter att HTML-innehållet har lagts till
}

function addEventListeners() {
    let buttons = ananas.querySelectorAll("button");
    buttons.forEach(button => {
        button.addEventListener("click", testar);
    });

    let infoBtn = document.querySelector("#infoBtn");
    if (infoBtn) {
        infoBtn.addEventListener("click", () => {
            let info = document.getElementById("INFO");
            if (info.style.display === "none") {
                info.style.display = "block";
            } else {
                info.style.display = "none";
            }
        });
    }
}

function testar(event) {
    event.preventDefault();
    const klass = this.className;
    const value = this.value;

    // Återställ bakgrundsfärg för alla knappar i samma grupp
    const buttons = document.querySelectorAll(`.${klass}`);
    buttons.forEach(button => {
        button.classList.remove('selected');
    });

    // Sätt den valda knappen till den annorlunda bakgrundsfärgen
    this.classList.add('selected');

    if (klass === "mattyp") {
        mattyp = value;
    } else if (klass === "alkohol") {
        alkohol = value;
    } else if (klass === "uteservering") {
        uteservering = value;
    } else if (klass === "attractionType") {
        attraktion = value;
    } else if (klass === "activityType") {
        activityType = value;
        console.log(activityType)
    } else if (klass === "fysiskt") {
        fysiskt = value;
    } else if (klass === "disability") {
        disability = value;
    }

    let url;
    if (typ === "Food") {
        url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getfromlatlng&lat=${lat}&lng=${lng}&radius=30&settings=${mattyp}&alcohol_licence=${alkohol}&outdoor_seating=${uteservering}`;
        if (mattyp === "buffe") {
            url += "&buffet_option=y";
        }
        if (mattyp === "A_LA_CARTE") {
            url += "&sub_types=A_LA_CARTE";
        }
    }
    if (typ === "attraction") {
        url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=attraction&method=getfromlatlng&lat=${lat}&lng=${lng}&radius=30&descriptions=${attraktion}`;
    }
    if (typ === "activity") {
        url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getfromlatlng&lat=${lat}&lng=${lng}&radius=30&descriptions=${activityType}&physical_efforts=${fysiskt}&disability_support=${disability}`;
        if (disability === "N") {
            url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getfromlatlng&lat=${lat}&lng=${lng}&radius=30&descriptions=${activityType}&physical_efforts=${fysiskt}`;
        }
        if(activityType == "Paintballcenter"){
            url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getfromlatlng&lat=${lat}&lng=${lng}&radius=100&descriptions=${activityType}&physical_efforts=${fysiskt}`;
        }
    }
    fetchSMAPI(url);
    console.log(url);
}

async function fetchSMAPI(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fel vid hämtning av data");

        const jsonData = await response.json();
        displayData(jsonData.payload);

    } catch (error) {
        console.error("Fel vid hämtning:", error);
    }
}

function displayData(data) {
    const planeraLista = document.querySelector("#planeraLista");
    planeraLista.innerHTML = ""; // Clear previous results

    // Create and append the image element
    let img = document.createElement("img");
    img.src = "bilder/g4.png";
    planeraLista.appendChild(img);

    // Create and append h3 elements for each item in the data
    data.forEach(obj => {
        let klick = document.querySelector("#klick")
        klick.style.display = "none"
        let h3 = document.createElement("h4");
        h3.textContent = obj.name;
        planeraLista.appendChild(h3);
    });

    if (planeraLista.textContent === "") {
        planeraLista.innerHTML = "Tyvärr hittade vi inga aktiviteter som passade dina önskemål!";
    }
}
