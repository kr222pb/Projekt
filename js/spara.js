let savedActivity;

function init() {
    //Ladda aktiviteter från localStorage
    getData();

    //Gruppera aktiviteter efter datum
    const groupedActivities = groupActivitiesByDate(savedActivity);

    //Skapa en container för miniboxar
    const container = document.createElement("div");
    container.id = "activityContainer";

    //Skapa en minibox för varje grupp av aktiviteter
    groupedActivities.forEach((activities, date) => {
        createMiniboxForActivities(activities, date, container);
    });

    const main = document.querySelector("main");
    main.appendChild(container);

    openList();
}

window.addEventListener("DOMContentLoaded", init);

function ConNewDiv(activity, activityIndex, date) {
    const div = document.createElement("div");
    div.className = "testar";

    const name = document.createElement("h2");
    name.textContent = activity.name;
    div.appendChild(name);

    const dateElement = document.createElement("h3");
    dateElement.textContent = activity.addedAt;
    div.appendChild(dateElement);

    const pinImg = document.createElement("img");
    pinImg.src = "bilder/g4.png";
    pinImg.id = "häftstift";
    div.appendChild(pinImg);

    const heartIcon = document.createElement("img"); 
    heartIcon.className = "heart-icon";
    heartIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        toggleFavorite(activity, activityIndex, date);
    });
    div.appendChild(heartIcon);

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

    const minibox = document.createElement("div");
    minibox.className = "minibox";

    const headerDiv = document.createElement("div");
    headerDiv.className = "head";

    const newH2 = document.createElement("h2");
    newH2.textContent = date;
    headerDiv.appendChild(newH2);

    //Skapar bilden med pilen 
    const pil = document.createElement("img");
    pil.src = "bilder/pil2.svg";
    pil.className = "pil";
    pil.alt = "Pil";
    headerDiv.appendChild(pil);

    //Skapar bilden för soptunnan
    const soptunna = document.createElement("img");
    soptunna.src = "bilder/soptunna.svg";
    soptunna.className = "tunna";
    soptunna.alt = "Soptunna";
    headerDiv.appendChild(soptunna);

    //Gör så den går klicka på
    soptunna.addEventListener("click", () => {
        removeDateDiv(minibox, date);
    });

    // Skapa en div för att hålla alla aktivitetselement
    const activitiesDiv = document.createElement("div");
    activitiesDiv.style.display = "none"; 
    activitiesDiv.className = "activitiesDiv";

    activities.forEach((activity, index) => {
        const activityDiv = ConNewDiv(activity, index, date);
        activitiesDiv.appendChild(activityDiv);
    });

    minibox.appendChild(headerDiv);
    minibox.appendChild(activitiesDiv);

    container.appendChild(minibox);
}

function groupActivitiesByDate(activities) {
    const groupedActivities = new Map();

    //Gruppera aktiviteter efter datum
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
    //Gör så pilen fungerar
    document.querySelectorAll(".pil").forEach(img => {
        img.addEventListener("click", () => {
            const minibox = img.closest(".minibox");
            const activitiesDiv = minibox.querySelector(".activitiesDiv");
            if (activitiesDiv.style.display === "none") {
                img.classList.add("rotated");
                activitiesDiv.style.display = "block";
                minibox.style.borderRadius = '20px';
                minibox.style.padding = "10px";
            } else {
                activitiesDiv.style.display = "none";
                img.classList.remove("rotated");
            }
        });
    });
}

function tabort(activityIndex, date, activityDiv) {
    // Visa dialogrutan
    const confirmBox = document.getElementById('confirmBox');
    confirmBox.showModal();

    // Stäng dialogrutan
    const closeModal = () => {
        confirmBox.close();
    };

    const confirmNo = document.getElementById('confirmNo');
    confirmNo.onclick = closeModal;

    // Hantera Ja-knappen
    const confirmYes = document.getElementById('confirmYes');
    confirmYes.onclick = function() {
        // Ta bort den specifika aktiviteten från savedActivity
        savedActivity = savedActivity.filter((activity, index) => {
            const activityDate = new Date(activity.addedAt).toLocaleDateString();
            return !(index === activityIndex && activityDate === date);
        });

        saveData();
        activityDiv.remove();

        // Stäng dialogrutan
        closeModal();
    };

    // Stäng dialogrutan om användaren klickar utanför rutan
    confirmBox.addEventListener('click', function(event) {
        if (event.target === confirmBox) {
            closeModal();
        }
    });
}

function removeDateDiv(minibox, date) {
    // Visa dialogrutan
    const confirmBox = document.getElementById('confirmBox');
    confirmBox.querySelector('p').textContent = "Är du säker på att du vill ta bort alla aktiviteter för detta datum?";
    confirmBox.showModal();

    // Stäng dialogrutan
    const closeModal = () => {
        confirmBox.close();
        confirmBox.querySelector('p').textContent = "Är du säker på att du vill ta bort denna aktivitet?";
    };

    const confirmNo = document.getElementById('confirmNo');
    confirmNo.onclick = closeModal;

    // Hantera Ja-knappen
    const confirmYes = document.getElementById('confirmYes');
    confirmYes.onclick = function() {
        // Ta bort alla aktiviteter för ett specifikt datum från savedActivity
        savedActivity = savedActivity.filter(activity => {
            const activityDate = new Date(activity.addedAt).toLocaleDateString();
            return activityDate !== date;
        });

        saveData();
        minibox.remove();

        // Stäng dialogrutan
        closeModal();
    };

    // Stäng dialogrutan om användaren klickar utanför rutan
    confirmBox.addEventListener('click', function(event) {
        if (event.target === confirmBox) {
            closeModal();
        }
    });
}

function saveData() {
    localStorage.setItem("savedActivity", JSON.stringify(savedActivity));
}

function getData() {
    savedActivity = JSON.parse(localStorage.getItem("savedActivity")) || [];
}

window.addEventListener("DOMContentLoaded", init);
