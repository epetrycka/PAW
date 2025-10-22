const input = document.querySelector("#board-in");
const acceptList = document.querySelector("#accept");
const output = document.querySelector(".output");
const removeFirst = document.querySelector(".delete");
const newElement = document.querySelector(".new");
const addButton = document.querySelector(".add");

let lista = input.value.split(" ");

acceptList.addEventListener("click", () => {
    lista = input.value.split(" ");
    output.textContent = input.value;
});

removeFirst.addEventListener("click", () => {
    if (lista.length > 0) {
        lista.shift();
        output.textContent = lista.join(" ");
    } else {
        alert("Brak elementów listy");
    }
});

addButton.addEventListener("click", () => {
    lista = lista.concat(newElement.value.split(" "));
    output.textContent = lista.join(" ");
});