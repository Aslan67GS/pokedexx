function pokemonTemplate(p){return`
    <div class="pokemon-card" onclick="openOverlay(${p.id})">
        <img src="${p.sprites.front_default}" alt="${p.name}">
        <h3>${p.name.toUpperCase()}</h3>${typesHTML(p)}
    </div>`;
}

function overlayTemplate(p, evoHTML) {
    return `
        <div class="overlay-card">
            <button class="close-btn" onclick="closeOverlay()">×</button>
            <img src="${p.sprites.front_default}" alt="${p.name}">
            <h2>${p.name.toUpperCase()}</h2>
            ${typesHTML(p)}
            <div class="overlay-tabs">
                <button onclick="showTab('stats')">Stats</button>
                <button onclick="showTab('evo')">Evolution</button>
            </div>
            <div id="stats-tab" class="tab-content">${statsHTML(p)}</div>
            <div id="evo-tab" class="tab-content hidden">${evoHTML}</div>
        </div>
    `;
}

const typesHTML = p => `
    <div class="types">
    ${p.types.map(t => `
        <span class="type ${t.type.name}">${t.type.name}</span>
    `).join('')}
    </div>
`;
const statsHTML = p => `
    <div class="stats">
    <p>HP: ${p.stats[0].base_stat}</p>
    <p>Attack: ${p.stats[1].base_stat}</p>
    <p>Defense: ${p.stats[2].base_stat}</p>
    </div>
`;

