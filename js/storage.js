let msgDiv

function showAcceptedSuggestions() {
    const savedActivity = JSON.parse(localStorage.getItem("savedActivity")) || [];
     msgDiv = document.getElementById("msg");
    msgDiv.style.display = "none";


    if (msgDiv) {
        if (savedActivity.length > 0) {
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

            msgDiv.innerHTML = '';  // Clear any existing content
            msgDiv.appendChild(ulElement);
        } else {
            msgDiv.innerHTML = "<p>Inga gillade aktiviteter.</p>";
        }
    } else {
        console.error("Element with id 'msg' not found.");
    }
    saveDate()
    openList()
}

function tabort(index) {
    let savedActivity = JSON.parse(localStorage.getItem("savedActivity")) || [];

    if (index !== -1) {
        savedActivity.splice(index, 1);
        localStorage.setItem("savedActivity", JSON.stringify(savedActivity));
        showAcceptedSuggestions();  // Refresh the list
    }
}

window.addEventListener("load", showAcceptedSuggestions);

function saveDate() {
    console.log("Banan")
    let date = new Date();
    let dateElem = document.querySelector("#date");
    dateElem.innerHTML = `
    <h2>${date.getDate()}/${date.getMonth() + 1} - ${date.getFullYear()}</h2>
    <img src="bilder/pil2.svg" alt="Pil">
    <img src="bilder/soptunna.svg" alt="Soptunna">
`;
}

function openList(){
    let img = document.querySelector("#date img")
    img.addEventListener("click", () => {
        if (msgDiv.style.display === "none") {
            img.classList.add("rotated")
            msgDiv.style.display = "block";
        } else {
            msgDiv.style.display = "none";
            img.classList.remove("rotated")
        }
    });
}
function saveData(){
    
}
