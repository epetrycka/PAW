const API_URL = 'https://restcountries.com/v3.1/all?fields=name,capital,population,area,subregion';
const tableBody = document.getElementById('table-body');
const paginationTop = document.getElementById('pagination-top');
const paginationBottom = document.getElementById('pagination-bottom');
const headers = document.querySelectorAll('thead th[data-column]');
const filters = {
    name: document.getElementById('filter-name'),
    capital: document.getElementById('filter-capital'),
    population: document.getElementById('filter-population'),
    area: document.getElementById('filter-area')
};

let fullData = [];
let groupedData = {};
let displayList = [];
let collapsedState = {};

let currentPage = 1;
const itemsPerPage = 10;
let currentSort = {
    column: 'name',
    direction: 'asc'
};

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Błąd pobierania danych');
        
        const data = await response.json();
        
        fullData = data.map(country => ({
            name: country.name.common,
            capital: (country.capital && country.capital[0]) || 'N/A',
            population: country.population || 0,
            area: country.area || 0,
            subregion: country.subregion || 'Undefined'
        }));
        
        fullData.forEach(c => {
            if (!collapsedState[c.subregion]) {
                collapsedState[c.subregion] = true;
            }
        });
        
        updateDisplayData();

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = `<tr><td colspan="4" class="loader" style="color: red;">Nie udało się załadować danych.</td></tr>`;
    }
}

function updateDisplayData() {
    const filterValues = getFilterValues();
    const filteredCountries = fullData.filter(country => matchesFilters(country, filterValues));

    groupedData = groupData(filteredCountries);
    displayList = Object.values(groupedData);

    sortDisplayList();

    const paginatedData = paginateData(displayList);

    renderTable(paginatedData);
    renderPagination(displayList.length);
}

function getFilterValues() {
    return {
        name: filters.name.value.toLowerCase(),
        capital: filters.capital.value.toLowerCase(),
        population: filters.population.value,
        area: filters.area.value
    };
}

function matchesFilters(country, filterValues) {
    return (
        country.name.toLowerCase().includes(filterValues.name) &&
        country.capital.toLowerCase().includes(filterValues.capital) &&
        country.population.toString().includes(filterValues.population) &&
        country.area.toString().includes(filterValues.area)
    );
}

function groupData(countries) {
    const groups = {};
    for (const country of countries) {
        const subregion = country.subregion;
        if (!groups[subregion]) {
            groups[subregion] = {
                name: subregion,
                totalPopulation: 0,
                totalArea: 0,
                countries: []
            };
        }
        groups[subregion].totalPopulation += country.population;
        groups[subregion].totalArea += country.area;
        groups[subregion].countries.push(country);
    }
    return groups;
}

function sortDisplayList() {
    const { column, direction } = currentSort;
    
    displayList.sort((a, b) => {
        let valA, valB;

        if (column === 'name') {
            valA = a.name;
            valB = b.name;
        } 
        else if (column === 'population') {
            valA = a.totalPopulation;
            valB = b.totalPopulation;
        } else if (column === 'area') {
            valA = a.totalArea;
            valB = b.totalArea;
        } 
        else if (column === 'capital') {
                valA = a.name;
                valB = b.name;
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

function paginateData(data) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
}


function renderTable(paginatedGroups) {
    tableBody.innerHTML = '';

    if (paginatedGroups.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="loader">Brak danych spełniających kryteria.</td></tr>`;
        return;
    }

    paginatedGroups.forEach(group => {
        const subregionRow = document.createElement('tr');
        subregionRow.className = 'subregion-row';
        subregionRow.dataset.subregion = group.name;
        
        subregionRow.innerHTML = `
            <td colspan="2">${group.name} (${group.countries.length} krajów)</td>
            <td>${group.totalPopulation.toLocaleString('pl-PL')}</td>
            <td>${group.totalArea.toLocaleString('pl-PL')}</td>
        `;
        tableBody.appendChild(subregionRow);
        
        const isCollapsed = collapsedState[group.name];
        
        group.countries.forEach(country => {
            const countryRow = document.createElement('tr');
            countryRow.className = 'country-row';
            countryRow.dataset.parent = group.name;
            if (isCollapsed) {
                countryRow.classList.add('hidden');
            }
            
            countryRow.innerHTML = `
                <td style="padding-left: 30px;">${country.name}</td>
                <td>${country.capital}</td>
                <td>${country.population.toLocaleString('pl-PL')}</td>
                <td>${country.area.toLocaleString('pl-PL')}</td>
            `;
            tableBody.appendChild(countryRow);
        });
    });
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const createPaginationHTML = () => {
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        return html;
    };
    
    const paginationHTML = createPaginationHTML();
    paginationTop.innerHTML = paginationHTML;
    paginationBottom.innerHTML = paginationHTML;
}


Object.values(filters).forEach(input => {
    input.addEventListener('keyup', () => {
        currentPage = 1;
        updateDisplayData();
    });
});

headers.forEach(header => {
    header.addEventListener('click', () => {
        const column = header.dataset.column;
        
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'asc';
        }
        
        headers.forEach(h => h.querySelector('i').className = 'fa-solid fa-sort');
        const icon = header.querySelector('i');
        icon.className = currentSort.direction === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down';

        updateDisplayData();
    });
});

function handlePaginationClick(event) {
    event.preventDefault();
    const target = event.target.closest('.page-link');
    
    if (target && target.dataset.page) {
        currentPage = parseInt(target.dataset.page, 10);
        updateDisplayData();
    }
}
paginationTop.addEventListener('click', handlePaginationClick);
paginationBottom.addEventListener('click', handlePaginationClick);

tableBody.addEventListener('click', (event) => {
    const row = event.target.closest('tr');
    
    if (row && row.classList.contains('subregion-row')) {
        const subregionName = row.dataset.subregion;
        
        collapsedState[subregionName] = !collapsedState[subregionName];
        
        const countryRows = tableBody.querySelectorAll(`.country-row[data-parent="${subregionName}"]`);
        countryRows.forEach(countryRow => {
            countryRow.classList.toggle('hidden', collapsedState[subregionName]);
        });
    }
});

fetchData();