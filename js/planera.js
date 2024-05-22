document.addEventListener("DOMContentLoaded", init);

let formElem;
let ananas;

function init() {
    ananas = document.querySelector("#ananas");
    ananas.innerHTML = "";
    formElem = document.querySelector("#form");
    formElem.addEventListener("change", readValue);

    // Add event listeners to all input fields
    const inputs = formElem.querySelectorAll("input, select");
    inputs.forEach(input => {
        input.addEventListener("change", readValue);
    });

    readValue();
}

function readValue() {
    let city = formElem.city.value;
    let typ = formElem.typ.value;

    if (typ !== "") {
        ananas.style.display = "block";
    } else {
        ananas.style.display = "none";
    }

    makeURL(city, typ);
}
function makeURL(city, typ) {
    let url;
    ananas.innerHTML = "";
    let extra = "";

    if (typ === "Food") {
        extra = `
        <div>
            <label><input type="radio" name="foodType" id="pizza" value="pizza">Pizza</label>
            <label><input type="radio" name="foodType" id="A_LA_CARTE" value="A_LA_CARTE">A_LA_CARTE</label>
            <label><input type="radio" name="foodType" id="cafe" value="cafe">Cafe</label>
            <label><input type="radio" name="foodType" id="buffe" value="buffe">Buffe</label>
            <label><input type="radio" name="foodType" id="ta_med" value="take_out">Ta med</label>
        </div>
        <h2>Alkohol:</h2>
        <div>
            <label><input type="radio" name="alkohol" id="alkoholJA" value="y">Ja</label>
            <label><input type="radio" name="alkohol" id="alkoholNej" value="n">Nej</label>
        </div>
        <h2>Uteservering:</h2>
        <div>
            <label><input type="radio" name="uteservering" id="uteserveringJA" value="y">Ja</label>
            <label><input type="radio" name="uteservering" id="uteserveringNEJ" value="n">Nej</label>
        </div>
        `;

        ananas.innerHTML = extra;

        // Lägg till event-lyssnare för att läsa värden när en radioknapp klickas
        document.querySelectorAll('input[name="foodType"], input[name="alkohol"], input[name="uteservering"]').forEach(input => {
            input.addEventListener('change', readValuesAndUpdateURL);
        });

    } else if (typ === "attraction") {
        extra = `
        <div>
            <label><input type="radio" name="attractionType" id="konstgalleri" value="konstgalleri,atteljé,konsthall">Konst</label>
            <label><input type="radio" name="attractionType" id="slott" value="slott">Slott</label>
            <label><input type="radio" name="attractionType" id="museum" value="Museum">Museum</label>
            <label><input type="radio" name="attractionType" id="glasbruk" value="Glasbruk">Glasbruk</label>
            <label><input type="radio" name="attractionType" id="sevärdhet" value="sevärdhet">Sevärdhet</label>
        </div>
        `;

        ananas.innerHTML = extra;
        document.querySelectorAll('input[name="attractionType"]').forEach(input => {
            input.addEventListener('change', readValuesAndUpdateURL);
        });

    } else {
        extra = `
        <div>
            <label><input type="radio" name="activityType" id="konst" value="art">Konst</label>
            <label><input type="radio" name="activityType" id="historia" value="HISTORY">Historia</label>
            <label><input type="radio" name="activityType" id="cafe" value="cafe">Cafe</label>
            <label><input type="radio" name="activityType" id="buffe" value="buffe">Buffe</label>
        </div>
        <h2>Alkohol:</h2>
        <div>
            <label><input type="radio" name="alkohol" id="alkoholJA" value="y">Ja</label>
            <label><input type="radio" name="alkohol" id="alkoholNej" value="n">Nej</label>
        </div>
        <h2>Uteservering:</h2>
        <div>
            <label><input type="radio" name="uteservering" id="uteserveringJA" value="y">Ja</label>
            <label><input type="radio" name="uteservering" id="uteserveringNEJ" value="n">Nej</label>
        </div>
        `;

        ananas.innerHTML = extra;
        document.querySelectorAll('input[name="activityType"], input[name="alkohol"], input[name="uteservering"]').forEach(input => {
            input.addEventListener('change', readValuesAndUpdateURL);
        });
    }

    function readValuesAndUpdateURL() {
        const foodType = document.querySelector('input[name="foodType"]:checked')?.value;
        const alkohol = document.querySelector('input[name="alkohol"]:checked')?.value;
        const uteservering = document.querySelector('input[name="uteservering"]:checked')?.value;

        if (typ === "Food") {
            if (["pizza", "A_LA_CARTE", "take_out", "cafe"].includes(foodType)) {
                url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getall&settings=${foodType}&alcohol_licence=${alkohol}&outdoor_seating=${uteservering}`;
            } else if (foodType === "buffe") {
                url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getall&buffet_option=y&alcohol_licence=${alkohol}&outdoor_seating=${uteservering}`;
            } else {
                url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getall&alcohol_licence=${alkohol}&outdoor_seating=${uteservering}`;
            }
        } else if (typ === "attraction") {
            const attractionType = document.querySelector('input[name="attractionType"]:checked')?.value;
            url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&cities=${city}&settings=${attractionType}`;
        } else {
            const activityType = document.querySelector('input[name="activityType"]:checked')?.value;
            url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getall&cities=${city}&settings=${activityType}&alcohol_licence=${alkohol}&outdoor_seating=${uteservering}`;
        }

        fetchSMAPI(url);
    }
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

    data.forEach(obj => {
        let h3 = document.createElement("h3");
        h3.textContent = obj.name;
        planeraLista.appendChild(h3);
    });
}
