let savedActivity;

function init() {
    // Ladda aktiviteter från localStorage
    getData();

    // Gruppera aktiviteter efter datum
    const groupedActivities = groupActivitiesByDate(savedActivity);

    // Skapa en container för miniboxar
    const container = document.createElement("div");
    container.id = "activityContainer";

    // Skapa en minibox för varje grupp av aktiviteter
    groupedActivities.forEach((activities, date) => {
        createMiniboxForActivities(activities, date, container);
    });

    // Lägg till containern till main
    const main = document.querySelector("main");
    main.appendChild(container);

    openList();
}

window.addEventListener("DOMContentLoaded", init);

function ConNewDiv(activity, activityIndex, date) {
    // Skapa ett div-element för aktiviteten
    const div = document.createElement("div");
    div.className = "testar";

    // Skapa och lägg till en h2-tag för aktivitetsnamnet
    const name = document.createElement("h2");
    name.textContent = activity.name;
    div.appendChild(name);

    // Skapa och lägg till en h3-tag för aktuellt datum och tid
    const dateElement = document.createElement("h3");
    dateElement.textContent = activity.addedAt;
    div.appendChild(dateElement);

    // Skapa och lägg till en img-tag för sopkorgsbilden
    const trash = document.createElement("img");
    trash.src = "bilder/soptunna.svg";
    trash.id = "tunna";
    trash.alt = "Soptunna";
    trash.addEventListener("click", () => {
        tabort(activityIndex, date, div);
    });
    div.appendChild(trash);

    return div;
}

function createMiniboxForActivities(activities, date, container) {
    // Skapa en ny minibox
    const minibox = document.createElement("div");
    minibox.className = "minibox";

    // Skapa en container div för header element
    const headerDiv = document.createElement("div");
    headerDiv.className = "head";

    // Skapa och lägg till newH2 i headerDiv
    const newH2 = document.createElement("h2");
    newH2.textContent = date; // Uppdatera med korrekt datum
    headerDiv.appendChild(newH2);

    // Skapa och lägg till pil i headerDiv
    const pil = document.createElement("img");
    pil.src = "bilder/pil2.svg";
    pil.className = "pil"; // Ändrad från id till class
    pil.alt = "Pil";
    headerDiv.appendChild(pil);

    // Skapa och lägg till soptunna i headerDiv
    const soptunna = document.createElement("img");
    soptunna.src = "bilder/soptunna.svg";
    soptunna.className = "tunna";
    soptunna.alt = "Soptunna";
    headerDiv.appendChild(soptunna);

    soptunna.addEventListener("click", () => {
        removeDateDiv(minibox, date);
    });

    // Skapa en div för att hålla alla aktivitetselement
    const activitiesDiv = document.createElement("div");
    activitiesDiv.style.display = "none"; // Dölj activitiesDiv vid initialisering
    activitiesDiv.className = "activitiesDiv";

    // Skapa en ConNewDiv för varje aktivitet och lägg till den i activitiesDiv
    activities.forEach((activity, index) => {
        const activityDiv = ConNewDiv(activity, index, date);
        activitiesDiv.appendChild(activityDiv);
    });

    // Lägg till headerDiv och activitiesDiv i minibox
    minibox.appendChild(headerDiv);
    minibox.appendChild(activitiesDiv);

    // Lägg till minibox i container
    container.appendChild(minibox);
}

function groupActivitiesByDate(activities) {
    const groupedActivities = new Map();

    // Gruppera aktiviteter efter datum
    activities.forEach((activity) => {
        const date = new Date(activity.addedAt).toLocaleDateString(); // Uppdaterat för att få datumet korrekt
        if (!groupedActivities.has(date)) {
            groupedActivities.set(date, []);
        }
        groupedActivities.get(date).push(activity);
    });
    return groupedActivities;
}

function openList() {
    document.querySelectorAll(".pil").forEach(img => {
        img.addEventListener("click", () => {
            const minibox = img.closest(".minibox");
            const activitiesDiv = minibox.querySelector(".activitiesDiv");
            if (activitiesDiv.style.display === "none") {
                img.classList.add("rotated");
                activitiesDiv.style.display = "block";
            } else {
                activitiesDiv.style.display = "none";
                img.classList.remove("rotated");
            }
        });
    });
}

function tabort(activityIndex, date, activityDiv) {
    const groupedActivities = groupActivitiesByDate(savedActivity);
    const activities = groupedActivities.get(date);
    if (activities && activityIndex !== -1) {
        activities.splice(activityIndex, 1);
        if (activities.length === 0) {
            groupedActivities.delete(date);
        } else {
            groupedActivities.set(date, activities);
        }
        savedActivity = Array.from(groupedActivities.values()).flat();
        saveData();
        activityDiv.remove(); // Ta bort den specifika aktiviteten från DOM:en
    }
}

function removeDateDiv(minibox, date) {
    // Ta bort alla aktiviteter för ett specifikt datum från savedActivity
    savedActivity = savedActivity.filter(activity => {
        const activityDate = new Date(activity.addedAt).toLocaleDateString();
        return activityDate !== date;
    });
    
    saveData();
    // Ta bort hela miniboxen från DOM:en
    minibox.remove();
}

function saveData() {
    localStorage.setItem("savedActivity", JSON.stringify(savedActivity));
}

function getData() {
    savedActivity = JSON.parse(localStorage.getItem("savedActivity")) || [];
}

// Anropa init-funktionen när DOMContentLoaded-eventet avfyras
window.addEventListener("DOMContentLoaded", init);
