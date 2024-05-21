function init(){
   readValue()
}

window.addEventListener("load", init);
function readValue(){
 let formElem = document.querySelector("#form")
 let test = formElem.city.value
    console.log(test)

let budget = formElem.budget.value
console.log(budget)
}

async function fetchAllEstablishmentData() {
    const url = `https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=establishment&method=getall`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fel vid hämtning av data");

        const jsonData = await response.json();
        combinedData = jsonData.payload;

    } catch (error) {
        console.error("Fel vid hämtning:", error);
        document.getElementById("messageDisplay").textContent = "Kunde inte ladda data.";
    }
}