
const image = document.querySelector(".image1");
const button = document.querySelector("#button2");

button.addEventListener("click", nextPhoto);

function nextPhoto() {
    let photoSrc = image.getAttribute("src");
    let photoNum = parseInt(photoSrc);
    photoNum++;
    if (photoNum > 3) {
        photoNum = 1;
    }
    image.setAttribute("src", `${photoNum}.jpg`);
}

const slider = document.querySelector(".slider");

slider.addEventListener("change", sliderChange);

function sliderChange() {
    let value = slider.value;
    image.setAttribute("src", `${value}.jpg`);
}