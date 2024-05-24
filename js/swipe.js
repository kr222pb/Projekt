// Globala variabler för swipe-funktionen
let startX, moved = false;
const minSwipe = 124;

function initSwipe() {
    let swipeImage = document.querySelector(".container");
    let swipeTextH2 = document.querySelector("h2");
    let swipeTextH3 = document.querySelector("h3");

    swipeImage.addEventListener("touchstart", handleTouchStart, false);
    swipeImage.addEventListener("touchmove", (e) => handleTouchMove(e, swipeTextH2, swipeTextH3), false);
    swipeImage.addEventListener("touchend", handleTouchEnd, false);
}

window.addEventListener("load", initSwipe);

function handleTouchStart(e) {
    let touch = e.touches[0];
    startX = touch.pageX;
    moved = false;
}

function handleTouchEnd(e) {
    if (!moved) {
        resetImagePosition();
        return;
    }
    let touch = e.changedTouches[0];
    let endX = touch.pageX;
    let diffX = endX - startX;

    if (Math.abs(diffX) < minSwipe) {
        resetImagePosition();
        return;
    }

    if (diffX > 0) {
        showFeedback('right');
        swipeRight();
    } else {
        showFeedback('left');
        swipeLeft();
    }
}

function handleTouchMove(e, swipeTextH2, swipeTextH3) {
    moved = true;
    let touch = e.touches[0];
    let moveX = touch.pageX;
    let diffX = moveX - startX;

    let swipeImage = document.querySelector(".container");
    swipeImage.style.transform = 'translateX(' + diffX + 'px)';
    swipeImage.style.transition = 'none';

    let maxSwipeDistance = window.innerWidth / 2;
    let opacity = 1 - Math.min(Math.abs(diffX) / maxSwipeDistance, 1);
    swipeImage.style.opacity = opacity;
    swipeTextH2.style.opacity = opacity;
    swipeTextH3.style.opacity = opacity;

    e.preventDefault();
}

function resetImagePosition() {
    let swipeImage = document.querySelector(".container");
    swipeImage.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    swipeImage.style.transform = 'translateX(0px)';
    swipeImage.style.opacity = '1';
    let swipeTextH2 = document.querySelector("h2");
    let swipeTextH3 = document.querySelector("h3");
    swipeTextH2.style.transition = 'opacity 0.3s ease-out';
    swipeTextH3.style.transition = 'opacity 0.3s ease-out';
    swipeTextH2.style.opacity = '1';
    swipeTextH3.style.opacity = '1';
}

function showFeedback(direction) {
    const feedback = document.createElement("img");
    feedback.src = direction === 'right' ? "bilder/bockf.svg" : "bilder/kryssf.svg";
    feedback.className = "feedback";

    const container = document.querySelector(".container");
    container.appendChild(feedback);

    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            container.removeChild(feedback);
        }, 300);
    }, 400);
}

function swipeRight() {
    animateSwipe('right', () => {
        document.getElementById("bock").click();
    });
}

function swipeLeft() {
    animateSwipe('left', () => {
        document.getElementById("kryss").click();
    });
}

function animateSwipe(direction, callback) {
    const container = document.querySelector(".container");
    const swipeDistance = direction === 'right' ? window.innerWidth : -window.innerWidth;

    container.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    container.style.transform = `translateX(${swipeDistance}px)`;
    container.style.opacity = '0';

    setTimeout(() => {
        container.style.transition = 'none';
        container.style.transform = 'translateX(0)';
        container.style.opacity = '1';
        container.classList.add("hidden");
        setTimeout(() => {
            container.classList.remove("hidden");
            resetImagePosition();
            callback();
        }, 10);
    }, 300);
}