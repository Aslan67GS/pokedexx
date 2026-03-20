const BASE_URL = "https://pokeapi.co/api/v2/";
let cachedPokemon = {};
let offset = 0;
const limit = 20;

function renderPokemon(pokemon) {
    const container = document.getElementById("pokemon-container");
    container.innerHTML += pokemonTemplate(pokemon);
}

async function fetchPokemon(idOrName) {
    if(cachedPokemon[idOrName]) return cachedPokemon[idOrName];
    const response = await fetch(BASE_URL + "pokemon/" + idOrName);
    const data = await response.json();
    cachedPokemon[idOrName] = data;
    return data;
}

async function loadPokemonBatch() {
    const btn = document.getElementById("load-more-btn");
    btn.disabled = true;
    btn.textContent = "Loading...";
    const pokemons = await Promise.all(
        Array.from({length: limit}, (_, i) => fetchPokemon(offset + i + 1))
    );
    pokemons.forEach(renderPokemon);
    offset += limit;
    btn.disabled = false;
    btn.textContent = "Load More Pokémon";
}

async function searchPokemon() {
    const value = document.getElementById("search").value.toLowerCase();
    const container = document.getElementById("pokemon-container");
    container.innerHTML = "";
    if(value.length < 3) return container.innerHTML = `<p style="text-align:center; width:100%;">Please enter at least 3 letters</p>`;
    try {
        const data = await (await fetch(`${BASE_URL}pokemon?limit=100000`)).json();
        const results = data.results.filter(p => p.name.includes(value));
        if(results.length === 0) return container.innerHTML = `<p style="text-align:center; width:100%;">No Pokémon found for "${value}"</p>`;
        for(let i=0; i<Math.min(10, results.length); i++) renderPokemon(await fetchPokemon(results[i].name));
    } catch {
        container.innerHTML = `<p style="text-align:center; width:100%;">Error loading Pokémon</p>`;
    }
}

document.getElementById("load-more-btn")
    .addEventListener("click", loadPokemonBatch);

window.addEventListener("DOMContentLoaded", () => {
    loadPokemonBatch();
});