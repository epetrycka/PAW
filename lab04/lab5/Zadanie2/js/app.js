// write code to show or hide ( depends on current state) context message block when you click button

const button = document.querySelector("#button");
const message = document.querySelector("#message");

button.addEventListener("click", clicked);

function clicked() {
    message.classList.toggle("hide")
}