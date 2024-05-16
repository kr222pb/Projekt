let msgDiv;
let dateDiv;
let savedActivity;
let savedLista
let dateList = []

function showAcceptedSuggestions() {
    let soptunna = document.querySelector("#tunna")
    soptunna.addEventListener("click", () => {
                // Ta bort div-elementet med id "date"
                let minibox = document.getElementById("minibox");
                let dateToRemove = minibox.querySelector(".date");
                minibox.removeChild(dateToRemove);
        
                // Ta bort datumet från dateList
                let h2 = dateToRemove.querySelector("h2");
                let dateToRemoveText = h2.textContent;
                let indexToRemove = dateList.indexOf(dateToRemoveText);
                if (indexToRemove !== -1) {
                    dateList.splice(indexToRemove, 1);
                }
        
                // Uppdatera localStorage
                saveData();
    })

    savedActivity = JSON.parse(localStorage.getItem("savedActivity")) || [];
     savedLista = localStorage.getItem("lista")
    
    msgDiv = document.getElementById("msg");
    msgDiv.style.display = "none";
    let containsToday = dateList.some(dateDiv => {
        let h2 = dateDiv.querySelector("h2");
        if (h2) {
            let dateString = h2.textContent;
            // Extract date, month, and year from the string
            let [day, month, year] = dateString.split("/");
            let date = new Date(year, month - 1, day); // Months are zero-based in JavaScript Date
            let today = new Date(); // Get today's date
            return date.toDateString() === today.toDateString(); // Compare dates
        }
        return false;
    });

    if (!containsToday) {
        makeNewDiv();
    }
 
    openList()
}

function tabort(index) {
    if (index !== -1) {
        savedActivity.splice(index, 1);
        localStorage.setItem("savedActivity", JSON.stringify(savedActivity));
        makeList();  // Refresh the list
    }
}

window.addEventListener("load", showAcceptedSuggestions);

function openList() {
    let img = document.querySelector("#pil");
    console.log(img);
    img.addEventListener("click", () => {
        if (msgDiv.style.display === "none") {
            img.classList.add("rotated");
            msgDiv.style.display = "block";
        } else {
            msgDiv.style.display = "none";
            img.classList.remove("rotated");
        }
    });
}

function makeNewDiv() {
    let minibox = document.getElementById("minibox");

    // Skapa en div med klassen "date"
    dateDiv = document.createElement("div");
    dateDiv.className = "date";

    let headDiv = document.createElement("div");
    headDiv.className = "head";
  

    // Skapa en h2-tag inom den nya div'en
    let date = new Date();
    let newH2 = document.createElement("h2");
    newH2.textContent = `${date.getDate()}/${date.getMonth() + 1} - ${date.getFullYear()}`;
    dateList.push(newH2.textContent)
    console.log(dateList)

    // Lägg till bilderna
    let pil = document.createElement("img");
    pil.src = "bilder/pil2.svg";
    pil.id = "pil";
    pil.alt = "alt=pil";

    let soptunna = document.createElement("img");
    soptunna.src = "bilder/soptunna.svg";
    soptunna.id = "tunna"
    soptunna.alt = "alt=Soptunna";

    // Lägg till elementen i head-div'en
    headDiv.appendChild(newH2);
    headDiv.appendChild(pil);
    headDiv.appendChild(soptunna);
    minibox.appendChild(headDiv);

    // Lägg till date-div'en i minibox
    minibox.appendChild(dateDiv);

    makeList();
}

function makeList() {
let msg = document.querySelector("#msg")
msg.innerHTML = ""
    // Skapa ul-element och lägg till sparade aktiviteter
    let ulElement = document.createElement("ul");

    savedActivity.forEach((suggestion, index) => {
        let liElement = document.createElement("li");
        liElement.textContent = suggestion.name;

        let imgElem = document.createElement("img");
        imgElem.src = "bilder/soptunna.svg";
        imgElem.setAttribute("id", "soptunna");
        imgElem.addEventListener("click", () => tabort(index));

        liElement.appendChild(imgElem);
        ulElement.appendChild(liElement);
    });

    // Lägg till ul-elementet i msg-div'en
    msgDiv.appendChild(ulElement);

    // Lägg till msg-div'en i date-div'en
    dateDiv.appendChild(msgDiv);
    saveData()
}
function saveData(){
    let miniboxElem = document.querySelector(".date")
    let miniboxString = miniboxElem.innerHTML
    localStorage.setItem("lista", miniboxString)
}