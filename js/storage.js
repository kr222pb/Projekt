let msgDiv;
let dateDiv;
let savedActivity;
let dateList = [];
let thisTime = [];

function showAcceptedSuggestions() {
    //Ta in från localstorage igen
    savedActivity = JSON.parse(localStorage.getItem("savedActivity")) || [];
    thisTime = JSON.parse(sessionStorage.getItem("thisTime")) || [];

    msgDiv = document.querySelector("#msg");
    msgDiv.style.display = "none";

    if (thisTime.length === 0) {
        makeNewDiv();
    } else {
        makeOldDiv();
    }

    //Ladda in från localstorage
    const previousSessions = JSON.parse(localStorage.getItem("previousSessions")) || [];
    previousSessions.forEach(sessionActivities => {
        createDivFromActivities(sessionActivities);
    });

    makeList();
    openList();
}

function createDivFromActivities(activities) {
    let minibox = document.getElementById("minibox");


    let oldDateDiv = document.createElement("div");
    oldDateDiv.className = "date";

    let headDiv = document.createElement("div");
    headDiv.className = "head";

    // Create a new h2 element with today's date
    let date = new Date();
    let newH2 = document.createElement("h2");
    newH2.textContent = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    dateList.push(newH2.textContent);

    // Add images
    let pil = document.createElement("img");
    pil.src = "bilder/pil2.svg";
    pil.id = "pil";
    pil.alt = "Pil";

    let soptunna = document.createElement("img");
    soptunna.src = "bilder/soptunna.svg";
    soptunna.id = "tunna";
    soptunna.alt = "Soptunna";

    // Add elements to the head div
    headDiv.appendChild(newH2);
    headDiv.appendChild(pil);
    headDiv.appendChild(soptunna);
    oldDateDiv.appendChild(headDiv);

    // Add date div to minibox
    minibox.appendChild(oldDateDiv);

    let msg = document.createElement("div");
    msg.className = "msg";
    let ulElement = document.createElement("ul");

    activities.forEach(activity => {
        let liElement = document.createElement("li");
        liElement.textContent = activity.name;
        ulElement.appendChild(liElement);
    });

    msg.appendChild(ulElement);
    oldDateDiv.appendChild(msg);
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
    if (img) {
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
}

function makeNewDiv() {
    let minibox = document.getElementById("minibox");

    // Create a div with class "date"
    dateDiv = document.createElement("div");
    dateDiv.className = "date";

    let headDiv = document.createElement("div");
    headDiv.className = "head";

    // Create an h2 tag within the new div
    let date = new Date();
    let newH2 = document.createElement("h2");
    newH2.textContent = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    dateList.push(newH2.textContent);

    // Add images
    let pil = document.createElement("img");
    pil.src = "bilder/pil2.svg";
    pil.id = "pil";
    pil.alt = "Pil";

    let soptunna = document.createElement("img");
    soptunna.src = "bilder/soptunna.svg";
    soptunna.id = "tunna";
    soptunna.alt = "Soptunna";

    // Add elements to the head div
    headDiv.appendChild(newH2);
    headDiv.appendChild(pil);
    headDiv.appendChild(soptunna);
    dateDiv.appendChild(headDiv);

    // Add date div to minibox
    minibox.appendChild(dateDiv);

    makeList();

    soptunna.addEventListener("click", () => {
        // Remove the entire minibox
        minibox.innerHTML = "";
        localStorage.removeItem("lista");
    });
}

function makeOldDiv() {
    let minibox = document.getElementById("minibox");

    // Create a div with class "date"
    dateDiv = document.createElement("div");
    dateDiv.className = "date";

    let headDiv = document.createElement("div");
    headDiv.className = "head";

    // Create a new h2 element with today's date
    let date = new Date();
    let newH2 = document.createElement("h2");
    newH2.textContent = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    dateList.push(newH2.textContent);

    // Add images
    let pil = document.createElement("img");
    pil.src = "bilder/pil2.svg";
    pil.id = "pil";
    pil.alt = "Pil";

    let soptunna = document.createElement("img");
    soptunna.src = "bilder/soptunna.svg";
    soptunna.id = "tunna";
    soptunna.alt = "Soptunna";

    // Add elements to the head div
    headDiv.appendChild(newH2);
    headDiv.appendChild(pil);
    headDiv.appendChild(soptunna);
    dateDiv.appendChild(headDiv);

    // Add date div to minibox
    minibox.appendChild(dateDiv);

    makeList();

    soptunna.addEventListener("click", () => {
        // Remove the entire minibox
        minibox.innerHTML = "";
        localStorage.removeItem("lista");
    });
}

function makeList() {
    let msg = document.querySelector("#msg");
    msg.innerHTML = ""; // Clear previous content

    // Create ul element and add saved activities
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

    // Add ul element to msg div
    msg.appendChild(ulElement);

    // Add msg div to date div
    dateDiv.appendChild(msg);

    // Save current session activities
    sessionStorage.setItem("thisTime", JSON.stringify(thisTime));

    // Save data to local storage
    saveData();
}

function saveData() {
    // Save the current session to localStorage when the user leaves the page
    window.addEventListener("beforeunload", () => {
        let previousSessions = JSON.parse(localStorage.getItem("previousSessions")) || [];
        if (thisTime.length > 0) {
            previousSessions.push(thisTime);
            localStorage.setItem("previousSessions", JSON.stringify(previousSessions));
            sessionStorage.removeItem("thisTime"); // Clear the session storage
        }
    });

    // Save the current state of the minibox to localStorage
    let miniboxElem = document.querySelector("#minibox");
    let miniboxString = miniboxElem.innerHTML;
    localStorage.setItem("lista", miniboxString);
}
