const circles = document.querySelectorAll(".circle");
const num = circles.length;

for (let i = 0; i < num; i++) {
    let angle = (360 / num) * i;
    circles[i].style.transform = `rotate(${angle}deg) translateY(-500%)`;
}

let start = 0;
setInterval (() => {
    start += 1;
    if (start > num) {
        start = 0;
    }
    changeColor(start);
}, 100);

function changeColor(start) {
    for (let i = 0; i < num; i++) {
        let element = (start + i)%num;
        circles[element].style.backgroundColor = `rgb(255, 255, 255, ${i/num})`;
    }
}