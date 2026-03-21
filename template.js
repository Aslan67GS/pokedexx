function pokemonTemplate(pokemon) {
    const typesHTML = pokemon.types
        .map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`)
        .join("");

    return `
        <div class="pokemon-card" onclick="openOverlay(${pokemon.id})">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name.toUpperCase()}</h3>
            <div class="types">${typesHTML}</div>
        </div>
    `;
}

function overlayTemplate(pokemon) {
    return `
        <div class="pokemon-card">
            <img src="${pokemon.sprites.front_default}">
            <h2>${pokemon.name.toUpperCase()}</h2>
        </div>
    `;
}