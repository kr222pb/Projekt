//Globala variabler
let timerActive = false;

function init() {

    let startBtn = document.getElementById("bock")
    startBtn.addEventListener("click", startTimer) //Starttimern startas nu via bocken 

} 
window.addEventListener("load", init);

function startTimer() {

    if (timerActive) {
        return;
    }

    let selectedValue = document.getElementById("timeSelect").value;

    if (selectedValue === "infinite") {
        return;
    }

    timerActive = true; // Förhindrar nya timers att köra
    let time = parseInt(selectedValue)
     document.getElementById("timerDisplay").innerHTML = time;

    let countdown = setInterval(function() {
        time--; // Minska tiden först
        if (time <= 0) {
             clearInterval(countdown);
            document.getElementById("timerDisplay").innerHTML = "Tiden är ute!";
            timerActive = false; // Återställer timern
            } else {
                document.getElementById("timerDisplay").innerHTML = time;
            }
        }, 1000); // Kör funktionen varje sekund
}