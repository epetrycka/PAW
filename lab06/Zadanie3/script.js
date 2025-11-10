fetch('city.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        solveA(data);
        solveB(data);
        solveC(data);
        solveD(data);
        solveE(data);
        solveF(data);
        solveG(data);
    })
    .catch(error => {
        console.error("Nie udało się wczytać pliku city.json:", error);
        document.getElementById('results-container').innerHTML = 
            `<p style="color: red; text-align: center;">
               BŁĄD: Nie można załadować pliku city.json.
             </p>`;
    });

function renderList(targetId, items) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    if (items.length === 0) {
        targetElement.innerHTML = '<li>Brak danych</li>';
        return;
    }
    
    targetElement.innerHTML = items.map(item => `<li>${item}</li>`).join('');
}

function renderText(targetId, text) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.textContent = text;
    }
}

function solveA(data) {
    const malopolskieCities = data
        .filter(city => city.province.toLowerCase() === 'małopolskie')
        .map(city => city.name);
    console.log(malopolskieCities);
        
    renderList('result-a', malopolskieCities);
}

function solveB(data) {
    const citiesWithTwoAs = data
        .filter(city => (city.name.match(/a/gi) || []).length === 2)
        .map(city => city.name);
        
    renderList('result-b', citiesWithTwoAs);
}

function solveC(data) {
    const sortedByDensity = [...data].sort((a, b) => b.density - a.density);
    
    let resultText = "Niewystarczająca ilość danych (mniej niż 5 miast).";
    
    if (sortedByDensity.length > 4) {
        const fifthCity = sortedByDensity[4];
        resultText = `${fifthCity.name} (Gęstość: ${fifthCity.density} os/km²)`;
    }
    
    renderText('result-c', resultText);
}

function solveD(data) {
    const citiesOver100k = data
        .filter(city => city.people > 100000)
        .map(city => `${city.name}`);
        
    renderList('result-d', citiesOver100k);
}

function solveE(data) {
    const over80k = data.filter(city => city.people > 80000).length;
    const under80k = data.filter(city => city.people < 80000).length;
    
    let comparison = "jest tyle samo";
    if (over80k > under80k) {
        comparison = "jest więcej miast > 80 000";
    } else if (under80k > over80k) {
        comparison = "jest więcej miast < 80 000";
    }
    
    const resultText = `Porównanie: ${comparison}. (Powyżej 80k: ${over80k}, Poniżej 80k: ${under80k})`;
    renderText('result-e', resultText);
}

function solveF(data) {
    const pCountyCities = data
        .filter(city => city.township.toLowerCase().startsWith('p'));
    
    let resultText = "Brak miast z powiatów na literę 'P'.";
    
    if (pCountyCities.length > 0) {
        const totalArea = pCountyCities.reduce((sum, city) => sum + city.area, 0);
        const avgArea = totalArea / pCountyCities.length;
        
        resultText = `Średnia powierzchnia: ${avgArea.toFixed(2)} km² (z ${pCountyCities.length} miast).`;
    }
    
    renderText('result-f', resultText);
}

function solveG(data) {
    const pomorskieCities = data
        .filter(city => city.province.toLowerCase() === 'pomorskie');
        
    const allOver5k = pomorskieCities.every(city => city.people > 5000);
    
    const citiesUnder5k = pomorskieCities
        .filter(city => city.people <= 5000)
        .map(city => city.name);
    
    let resultText = `Tak, wszystkie ${pomorskieCities.length} miast z woj. pomorskiego ma powyżej 5000 mieszkańców.`;
    
    if (!allOver5k) {
        resultText = `Nie. Znaleziono ${citiesUnder5k.length} miast z populacją <= 5000: ${citiesUnder5k.join(', ')}.`;
    }
    
    renderText('result-g', resultText);
}