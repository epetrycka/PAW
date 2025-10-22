// (source of event) button.addEventListener( onClick -> click, 
// fun_name (bez ()) / anonymous function (raw code) -> !removeEvent nie działa z anonymous, 
// true/false - default)

// const button = document.(get_by_element_id, get_by_class, get_query_selector -> pierwszy znaleziony, get_selector_all -> wszystkie które spełniają warunek)

// w 3 slider bez warunkowych if switch etc naciskasz -> i cos tam

function askAName() {
    const query = prompt("Wprowadź swoje imię")

    if (query !== '') {
        document.querySelector("#names").textContent = `${query}, `
    }
}