const planetsContainer = document.getElementById('planets-container');
const paginationContainer = document.getElementById('pagination-container');
let currentPage = 1;

async function fetchPlanets(page) {
    const response = await fetch(`https://swapi.dev/api/planets/?page=${page}`);
    const data = await response.json();
    return data;
}

function renderPlanetCard(planet) {
    const card = document.createElement('div');
    card.classList.add('planet-card');
    card.innerHTML = `
        <h2>${planet.name}</h2>
        <p>Climate: ${planet.climate}</p>
        <p>Population: ${planet.population}</p>
        <p>Terrain: ${planet.terrain}</p>
        ${planet.residents.length !== 0 ? '<ul class="resident-list">Residents:</ul>' : ''}
    `;
    planetsContainer.appendChild(card);

    // render residents if available
    if (planet.residents.length !== 0) {
        const residentList = card.querySelector('.resident-list');
        planet.residents.forEach(async (residentUrl) => {
            const residentResponse = await fetch(residentUrl);
            const residentData = await residentResponse.json();
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Name:</strong> ${residentData.name}, 
                <strong>Height:</strong> ${residentData.height}, 
                <strong>Mass:</strong> ${residentData.mass}, 
                <strong>Gender:</strong> ${residentData.gender}
            `;
            residentList.appendChild(listItem);
        });
    }
}

function renderPagination(data) {
    const totalPages = Math.ceil(data.count / data.results.length);
    paginationContainer.innerHTML = `
        <div class="pagination">
            <button id="prevPageBtn" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <span>Page ${currentPage} of ${totalPages}</span>
            <button id="nextPageBtn" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        </div>
    `;

    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAndRenderPlanets(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchAndRenderPlanets(currentPage);
        }
    });
}

async function fetchAndRenderPlanets(page) {
    planetsContainer.innerHTML = '';
    const data = await fetchPlanets(page);
    data.results.forEach(renderPlanetCard);
    renderPagination(data);
}

// Initial load
fetchAndRenderPlanets(currentPage);
