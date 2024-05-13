// Globala variabler
let startX, moved = false;
const minSwipe = 124;

function init() {
    let swipeImage = document.querySelector(".container");
    let swipeTextH2 = document.querySelector("h2");  // Lägger till en variabel för att hantera h2 element
    let swipeTextH3 = document.querySelector("h3");  // Lägger till en variabel för att hantera h3 element

    swipeImage.addEventListener("touchstart", handleTouchStart, false);
    swipeImage.addEventListener("touchmove", (e) => handleTouchMove(e, swipeTextH2, swipeTextH3), false); // Skicka textelementen som argument
    swipeImage.addEventListener("touchend", handleTouchEnd, false);
}

window.addEventListener("load", init);

function handleTouchStart(e) {
    let touch = e.touches[0];
    startX = touch.pageX;
    moved = false;
    console.log("Start", startX);
}

function handleTouchEnd(e) {
    if (!moved) {
        console.log("Inte en swipe");
        resetImagePosition();
        return;
    }
    let touch = e.changedTouches[0];
    let endX = touch.pageX;
    let diffX = endX - startX;

    if (Math.abs(diffX) < minSwipe) {
        console.log(diffX);
        resetImagePosition();
        return;
    }

    if (diffX > 0) {
        console.log("Swiped right");
        swipeRight();
    } else {
        console.log("Swiped left");
        swipeLeft();
    }

    resetImagePosition();
}

function handleTouchMove(e, swipeTextH2, swipeTextH3) {
    moved = true;
    let touch = e.touches[0];
    let moveX = touch.pageX;
    let diffX = moveX - startX;
    
    let swipeImage = document.querySelector(".container");
    swipeImage.style.transform = 'translateX(' + diffX + 'px)';
    
    let maxSwipeDistance = window.innerWidth / 2;
    let opacity = 1 - Math.min(Math.abs(diffX) / maxSwipeDistance, 1);
    swipeImage.style.opacity = opacity;
    swipeTextH2.style.opacity = opacity;  // Ändrar opacity för h2
    swipeTextH3.style.opacity = opacity;  // Ändrar opacity för h3

    e.preventDefault();
}

function resetImagePosition() {
    let swipeImage = document.querySelector(".container");
    swipeImage.style.transform = 'translateX(0px)';
    swipeImage.style.opacity = '1';
    let swipeTextH2 = document.querySelector("h2");
    let swipeTextH3 = document.querySelector("h3");
    swipeTextH2.style.opacity = '1';  // Återställer opacity för h2
    swipeTextH3.style.opacity = '1';  // Återställer opacity för h3
}

function swipeRight() {
    document.getElementById("bock").click();
}

function swipeLeft() {
    document.getElementById("kryss").click();
}
