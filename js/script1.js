document.addEventListener('DOMContentLoaded', function() {
    const filterTrigger = document.querySelector(".filter-trigger");
    const arrow = document.querySelector(".filter-trigger .arrow");
    const tabsContainer = document.querySelector(".scrollable-tabs-container");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const infoButton = document.getElementById("info");
    const infoPanel = document.getElementById("infoPanel");

    function updateArrowAnimation() {
        const isMenuActive = tabsContainer.classList.contains('active');
        const isAnyCityActive = Array.from(navLinks).some(link => link.classList.contains('active'));

        if (!isMenuActive && !isAnyCityActive) {
            arrow.style.animation = 'bounce 2s infinite ease-in-out';
            arrow.classList.remove('rotated');
        } else {
            arrow.style.animation = 'none';
        }
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            this.classList.toggle('active');
            updateArrowAnimation();
        });
    });

    filterTrigger.addEventListener("click", function() {
        const wasActive = tabsContainer.classList.contains('active');
        tabsContainer.classList.toggle("active");
        this.classList.toggle('active');

        if (!wasActive) {
            arrow.classList.add('rotated');
            arrow.style.animation = 'none';
        } else {
            setTimeout(() => {
                arrow.classList.remove('rotated');
                updateArrowAnimation();
            }, 300);
        }
    });




    infoButton.addEventListener('click', function() {
        if (infoPanel.style.transform === "translateY(0%)") {
            infoPanel.style.transform = "translateY(100%)";
        } else {
            infoPanel.style.transform = "translateY(0%)";
        }
    });

    // Function to smoothly scroll the navigation menu
    function scrollMenu(direction) {
        const scrollAmount = 200; // adjust scroll distance as needed
        if (direction === 'right') {
            navMenu.scrollTo({
                left: navMenu.scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        } else {
            navMenu.scrollTo({
                left: navMenu.scrollLeft - scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    leftArrow.addEventListener('click', function() {
        scrollMenu('left');
    });

    rightArrow.addEventListener('click', function() {
        scrollMenu('right');
    });
    infoPanel.style.transform = "translateY(100%)"; 

    updateArrowAnimation();
});
