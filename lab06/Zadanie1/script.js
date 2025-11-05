const box1 = document.getElementById('box1');
const box2 = document.getElementById('box2');
const box3 = document.getElementById('box3');

const togglePropagationBtn = document.getElementById('togglePropagation');
const resetBtn = document.getElementById('reset');
const clearLogBtn = document.getElementById('clearLog');
const log = document.getElementById('log');
const quizPanel = document.getElementById('quiz-panel');

let totalPoints = 0;
let isPropagationStopped = false;
let isBox2Active = true;
let isBox3Active = true;

const initialOrder = document.querySelector('input[name="order"]:checked').value;
attachListeners(initialOrder);
logEvent(`--- Aplikacja gotowa (Tryb: ${initialOrder}) ---`);

function logEvent(message) {
    const li = document.createElement('li');
    li.textContent = message;
    log.appendChild(li);
    log.scrollTop = log.scrollHeight;
}

function checkConditions() {
    if (totalPoints > 30 && isBox3Active) {
        isBox3Active = false;
        box3.removeEventListener('click', handleBox3Click, false);
        box3.removeEventListener('click', handleBox3Click, true);
        box3.style.opacity = '0.5';
        box3.style.cursor = 'not-allowed';
        logEvent("--- DEZAKTYWOWANO ŻÓŁTY (ponad 30 pkt) ---");
    }
    
    if (totalPoints > 50 && isBox2Active) {
        isBox2Active = false;
        box2.removeEventListener('click', handleBox2Click, false);
        box2.removeEventListener('click', handleBox2Click, true);
        box2.style.opacity = '0.5';
        box2.style.cursor = 'not-allowed';
        logEvent("--- DEZAKTYWOWANO CZERWONY (ponad 50 pkt) ---");
    }
}

function handleBox1Click(event) {
    if (isPropagationStopped) {
        event.stopPropagation();
        logEvent("--- Propagacja zatrzymana na Niebieskim ---");
    }
    logEvent("Nacisnąłeś Niebieski o wartości 1");
    totalPoints += 1;
    checkConditions();
}

function handleBox2Click(event) {
    if (isPropagationStopped) {
        event.stopPropagation();
        logEvent("--- Propagacja zatrzymana na Czerwonym ---");
    }
    logEvent("Nacisnąłeś Czerwony o wartości 2");
    totalPoints += 2;
    checkConditions();
}

function handleBox3Click(event) {
    if (isPropagationStopped) {
        event.stopPropagation();
        logEvent("--- Propagacja zatrzymana na Żółtym ---");
    }
    logEvent("Nacisnąłeś Żółty o wartości 3");
    totalPoints += 3;
    checkConditions();
}


function attachListeners(order) {
    let box1Capture = false;
    let box2Capture = false;
    let box3Capture = false;

    switch (order) {
        case '1-2-3':
            box1Capture = true;
            box2Capture = true;
            box3Capture = true;
            break;
        case '3-2-1':
            break;
        case '2-3-1':
            box1Capture = false;
            box2Capture = true;
            box3Capture = false;
            break;
        case '1-3-2':
            box1Capture = true;
            box2Capture = false;
            box3Capture = false;
            break;
    }

    box1.addEventListener('click', handleBox1Click, box1Capture);
    
    if (isBox2Active) {
        box2.addEventListener('click', handleBox2Click, box2Capture);
    }
    if (isBox3Active) {
        box3.addEventListener('click', handleBox3Click, box3Capture);
    }
}

function removeListeners() {
    box1.removeEventListener('click', handleBox1Click, false);
    box1.removeEventListener('click', handleBox1Click, true);
    
    box2.removeEventListener('click', handleBox2Click, false);
    box2.removeEventListener('click', handleBox2Click, true);
    
    box3.removeEventListener('click', handleBox3Click, false);
    box3.removeEventListener('click', handleBox3Click, true);
}


togglePropagationBtn.addEventListener('click', () => {
    isPropagationStopped = !isPropagationStopped;
    togglePropagationBtn.textContent = isPropagationStopped ? 'Start Propagation' : 'Stop Propagation';
    logEvent(isPropagationStopped ? "--- Propagacja WYŁĄCZONA ---" : "--- Propagacja WŁĄCZONA ---");
});


quizPanel.addEventListener('change', (event) => {
    if (event.target.type === 'radio' && event.target.checked) {
        const newOrder = event.target.value;
        removeListeners();
        attachListeners(newOrder);
        logEvent(`--- Zmieniono kolejność na: ${newOrder} ---`);
    }
});

clearLogBtn.addEventListener('click', () => {
    log.innerHTML = '';
});

resetBtn.addEventListener('click', () => {
    removeListeners();
    
    totalPoints = 0;
    isPropagationStopped = false;
    isBox2Active = true;
    isBox3Active = true;
    
    log.innerHTML = '';
    togglePropagationBtn.textContent = 'Stop Propagation';
    box2.style.opacity = '1';
    box2.style.cursor = 'pointer';
    box3.style.opacity = '1';
    box3.style.cursor = 'pointer';
    
    const defaultOrder = '3-2-1';
    document.querySelector(`input[name="order"][value="${defaultOrder}"]`).checked = true;
    
    attachListeners(defaultOrder);
    logEvent("--- APLIKACJA ZRESETOWANA ---");
});