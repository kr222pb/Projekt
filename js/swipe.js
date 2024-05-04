// Swipe funktionen inte helt färdig.
// Globala variabler
let startX, moved = false;
const minSwipe = 124;

function init() {
    let swipeImage = document.querySelector(".swipe");
    swipeImage.addEventListener("touchstart", handleTouchStart, false);
    swipeImage.addEventListener("touchmove", handleTouchMove, false);
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
        console.log("Inte en swipe");  // Logga att det inte var en swipe om ingen rörelse upptäcktes
        resetImagePosition(); // Återställer bildens position även om det var ett enkelt tryck
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
        swipeRight();  // Utför funktionen för swipe åt höger
    } else {
        console.log("Swiped left");
        swipeLeft();   // Utför funktionen för swipe åt vänster
    }

    resetImagePosition();  // Återställer bildens position efter swipe-händelsen
}

function handleTouchMove(e) {
    moved = true;
    let touch = e.touches[0];
    let moveX = touch.pageX;
    let diffX = moveX - startX;
    
    let swipeImage = document.querySelector(".swipe");
    swipeImage.style.transform = 'translateX(' + diffX + 'px)';
    
    // Beräkna ny opacity baserat på swipens horisontella avstånd
    let maxSwipeDistance = window.innerWidth / 2;  // Exempel: max avstånd = halva skärmens bredd
    let opacity = 1 - Math.min(Math.abs(diffX) / maxSwipeDistance, 1);
    swipeImage.style.opacity = opacity;
    
    e.preventDefault(); // Förhindra skrollning vertikalt
}

function resetImagePosition() {
    let swipeImage = document.querySelector(".swipe");
    swipeImage.style.transform = 'translateX(0px)';
    swipeImage.style.opacity = '1';  // Återställer opacityn till fullt synlig
}

function swipeRight() {
    // Simulerar ett klick på "bock"-knappen när man swipar höger
    document.getElementById("bock").click();
}

function swipeLeft() {
    // Simulerar ett klick på "kryss"-knappen när man swipar vänster
    document.getElementById("kryss").click();
}

