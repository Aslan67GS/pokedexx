function pokemonTemplate(p){return`
    <div class="pokemon-card" onclick="openOverlay(${p.id})">
        <img src="${p.sprites.front_default}" alt="${p.name}">
        <h3>${p.name.toUpperCase()}</h3>${typesHTML(p)}
    </div>`;
}

function overlayTemplate(p, evoHTML) {
    return `
    <div class="overlay-card">
        <button onclick="closeOverlay()">×</button>
        <div class="nav">
            <button onclick="changePokemon(-1)">←</button>
            <button onclick="changePokemon(1)">→</button>
        </div>
        <img src="${p.sprites.front_default}">
        <h2>${p.name.toUpperCase()}</h2>
        ${typesHTML(p)}
        ${tabsHTML(p, evoHTML)}
    </div>`;
}

function tabsHTML(p, evoHTML){
    return `
    <div class="overlay-tabs">
        <button onclick="showTab('stats')">Stats</button>
        <button onclick="showTab('evo')">Evolution</button>
    </div>
    <div id="stats-tab">${statsHTML(p)}</div>
    <div id="evo-tab" class="hidden">${evoHTML}</div>`;
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

