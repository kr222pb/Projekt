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

    let selectedValue = document.getElementById("timeSelect").value;

    if (selectedValue === "infinite") {
        return;
    }

    timerActive = true; // Förhindrar nya timers att köra
    let time = parseInt(selectedValue);
    document.getElementById("timerDisplay").innerHTML = time;

    let countdown = setInterval(function() {
        time--; // Minska tiden först
        if (time <= 0) {
            clearInterval(countdown);
            document.getElementById("timerDisplay").innerHTML = "Tiden är ute!";
            timerActive = false; // Återställer timern
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
    // Döljer polaroidbilderna och visar meddelandet
    const container = document.querySelector(".container");
    const options = document.querySelector(".options");
    const message = document.createElement("div");

    container.classList.add("hidden");
    options.classList.add("hidden");

    message.innerHTML = '<a href="profil.html"><img src="bilder/hjarta.svg" alt="Hjärta" class="pulse-heart"></a>';
    message.classList.add("end-message");
    document.body.appendChild(message);
}
