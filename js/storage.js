let msgDiv;
let dateDiv;
let savedActivity;
let dateList = [];
let thisTime = [];

function showAcceptedSuggestions() {
    // Load activities from localStorage
    savedActivity = JSON.parse(localStorage.getItem("savedActivity")) || [];
    // Load current session activities from sessionStorage
    thisTime = JSON.parse(sessionStorage.getItem("thisTime")) || [];

    msgDiv = document.getElementById("msg");
    msgDiv.style.display = "none";

    if (thisTime.length === 0) {
        makeNewDiv();
    } else {
        makeOldDiv();
    }

    // Load previous sessions' activities from localStorage
    const previousSessions = JSON.parse(localStorage.getItem("previousSessions")) || [];
    previousSessions.forEach(sessionActivities => {
        createDivFromActivities(sessionActivities);
    });

    makeList();
    openList();
}

function createDivFromActivities(activities) {
    let minibox = document.getElementById("minibox");

    // Create a div with class "date"
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
/* Profilsidan */
#bigbox{ 
    border: 5px solid rgb(117, 115, 115);
    border-radius: 20%;

    text-align: center;
    color: #fff;

    padding: 20px;
    margin: 200px;
    width: 60%;
}
#bigbox ul{
  font-size: 2em;
    text-align: left;
    list-style: none;
    padding: 15px;
    margin-top: 0px;
}
#bigbox li {
    padding-left: 20px; /* Justera vänstermarginalen för att ge plats för listpluppen */
    margin: 10px;
}

#bigbox li::before {
    content: '\2764'; /* Unicode-tecknet för hjärta */
    display: inline-block;
    margin-right: 5px; /* Justera avståndet mellan hjärtat och texten */
}
#minibox{
    background-color: #6c4a61;
    border-radius: 20%;
}

.head{
  display: flex;
  justify-content: center;
  width: 90%;
padding: 15px;
}
.minibox img{
    width: 40px;
    cursor: pointer;
    margin: 10px;
}
#msg{
    margin: 0px;
    padding: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.rotated {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
}