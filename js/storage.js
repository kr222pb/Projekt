function showAcceptedSuggestions() {
    const savedActivity = JSON.parse(localStorage.getItem("savedActivity")) || [];

    const msgDiv = document.getElementById("msg");

    if (msgDiv) {
        
        if (savedActivity.length > 0) {
            let suggestionList = '<ul>';

            
            savedActivity.forEach(suggestion => {
                suggestionList += `<li><strong>${suggestion.name}</li>`;
            });

            suggestionList += '</ul>';
            msgDiv.innerHTML = suggestionList;
        } else {
            msgDiv.innerHTML = "<p>Inga gillade aktiviteter.</p>";
        }
    } else {
        console.error("Element with id 'msg' not found.");
    }
}

window.addEventListener("load", showAcceptedSuggestions);