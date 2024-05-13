function showAcceptedSuggestions() {
    const savedActivity = JSON.parse(localStorage.getItem("savedActivity")) || [];
    const msgDiv = document.getElementById("msg");

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