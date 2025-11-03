const hamburger = document.querySelector("#menu-tgl");
const mobileMenu = document.querySelector(".mobile-menu");
const navbar = document.querySelector(".navbar");
const main = document.querySelector(".main");
const exit = document.querySelector(".exit");

function showHideMenu() {
    mobileMenu.classList.toggle("collapsed");
    navbar.classList.toggle("collapsed");
    main.classList.toggle("collapsed");
}

hamburger.addEventListener("click", () => {
    showHideMenu();
});

exit.addEventListener("click", () => {
    showHideMenu();
});

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > window.innerHeight) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});
