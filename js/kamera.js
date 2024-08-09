function init() {
    const kamera = document.getElementById("kamera");
    const container = document.querySelector(".container");
    const options = document.querySelector(".options");
    const cameraState = document.querySelector(".cameraState");
    const headerContent = document.querySelector(".header-content");

    kamera.addEventListener("click", () => {

        kamera.classList.remove("camera-move");

        kamera.classList.add("camera-rotate");

        setTimeout(() => {
            console.log("Timeout reached, updating classes");
            cameraState.classList.add("hidden");
            container.classList.remove("hidden");
            options.classList.remove("hidden");
            headerContent.classList.remove("hidden");

        }, 2000); //Samma längd som animationen
    });
}

window.addEventListener("load", init);
