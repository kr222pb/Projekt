//Globala variabler
let timerActive = false;

function initTimer() {
    let startBtn = document.getElementById("bock");
    startBtn.addEventListener("click", startTimer); //Starttimern startas nu via bocken
}
window.addEventListener("load", initTimer);

function startTimer() {
    if (timerActive) {
        return;
    }

    let timeSelect = document.getElementById("timeSelect");
    let selectedValue = document.getElementById("timeSelect").value;

    if (selectedValue === "infinite") {
        return;
    }

    timerActive = true; //Förhindrar nya timers att köra
    timeSelect.disabled = true;
    let time = parseInt(selectedValue);
    document.getElementById("timerDisplay").innerHTML = time;

    let countdown = setInterval(function() {
        time--; // Minska tiden först
        if (time <= 0) {
            clearInterval(countdown);
            document.getElementById("timerDisplay").innerHTML = "Tiden är ute!";
            timerActive = false; //Återställer timerrn
            timeSelect.disabled = false;
            showEndMessage();
        } else {
            document.getElementById("timerDisplay").innerHTML = time;
        }
    }, 1000); // Kör funktionen varje sekund
}

function startTimerIfNotActive() {
    if (!timerActive) {
        startTimer();
    }
}

function showEndMessage() {
    const container = document.querySelector(".container");
    const options = document.querySelector(".options");
    const message = document.createElement("div");

    container.classList.add("hidden");
    options.classList.add("hidden");

    message.innerHTML = '<a href="sparade_aktiviteter.html"><img src="bilder/hjarta.svg" alt="Hjärta" class="pulse-heart"></a>';
    message.classList.add("end-message");
    document.body.appendChild(message);
}
