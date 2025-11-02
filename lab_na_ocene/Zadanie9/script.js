const inputs = document.querySelectorAll("#colours input");
const img = document.querySelector("img");

inputs.forEach(input => {
    input.addEventListener("change", () => {
        img.src = `assets/t-shirt-${input.id}.png`;
    });
});