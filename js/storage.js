function showAcceptedSuggestions() {
    const savedActivity = JSON.parse(localStorage.getItem("savedActivity")) || [];

    // Access the msg div to display the results
    const msgDiv = document.getElementById("msg");

    if (msgDiv) {
        // Check if there are any saved suggestions
        if (savedActivity.length > 0) {
            let suggestionList = '<ul>';

            // Construct a list of suggestions
            savedActivity.forEach(suggestion => {
                suggestionList += `<li><strong>${suggestion.name}</li>`;
            });

            suggestionList += '</ul>';
            msgDiv.innerHTML = suggestionList;
        } else {
            msgDiv.innerHTML = "<p>No accepted suggestions yet.</p>";
        }
    } else {
        console.error("Element with id 'msg' not found.");
    }
}

// Execute the function when the page loads
window.addEventListener("load", showAcceptedSuggestions);