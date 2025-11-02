const picture = document.querySelector(".photo");
const img = picture.querySelector("img");
const buttons = document.querySelectorAll(".number");
const title = document.querySelector("#title")

let currentIndex = 1;

updateActiveButton();

function updateActiveButton() {
    buttons.forEach((button, index) => {
        if (currentIndex - 1 == index) {
            button.classList.add("active");
        }
        else {
            button.classList.remove("active");
        }
    });
};

buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        title.classList.add("fade-out");
        img.classList.add("fade-out");
        setTimeout(() => {
            title.textContent = `PAW ${index + 1}`;
            title.classList.remove("fade-out");
            img.classList.remove("fade-out");
            img.src = `assets/${index + 1}.jpg`;
            currentIndex = index + 1;
            updateActiveButton();
        }, 500);
    });
});