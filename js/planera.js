document.addEventListener("DOMContentLoaded", init);

let formElem;
let ananas

function init() {
     ananas = document.querySelector("#ananas");
     ananas.innerHTML = ""
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
    // let budget = formElem.budget.value;
    // let fysiskt = formElem.fysisk.value;
    let typ = formElem.typ.value;
    makeURL(city, typ);
}

function makeURL(city, typ) {
    let url;
    ananas.innerHTML = ""
    let extra = ""

    if (typ === "Food") {
        url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&cities=${city}`;
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
    
    }
    else if(typ === "attraction"){
        url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall&cities=${city}`;
        extra = `
        <div>
            <label><input type="radio" name="attractionType" id="konst" value="art">Konst</label>
            <label><input type="radio" name="attractionType" id="historia" value="HISTORY">Historia</label>
            <label><input type="radio" name="attractionType" id="cafe" value="cafe">Cafe</label>
            <label><input type="radio" name="attractionType" id="buffe" value="buffe">Buffe</label>
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
    }
    else{
        url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activityt&method=getall&cities=${city}`;
        extra = `
        <div>
            <label><input type="radio" name="attractionType" id="konst" value="art">Konst</label>
            <label><input type="radio" name="attractionType" id="historia" value="HISTORY">Historia</label>
            <label><input type="radio" name="attractionType" id="cafe" value="cafe">Cafe</label>
            <label><input type="radio" name="attractionType" id="buffe" value="buffe">Buffe</label>
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
    }
    
   
    ananas.innerHTML = extra;
    fetchSMAPI(url);
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
