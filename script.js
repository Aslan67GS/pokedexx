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
    if(value.length < 3) return alert("Please enter at least 3 letters");
    try {
        document.getElementById("pokemon-container").innerHTML = "";
        renderPokemon(await fetchPokemon(value));
    } catch {
        document.getElementById("pokemon-container").innerHTML = `<p style="text-align:center; width:100%;">No Pokémon found for "${value}"</p>`;
    }
}

document.getElementById("load-more-btn")
    .addEventListener("click", loadPokemonBatch);

window.addEventListener("DOMContentLoaded", () => {
    loadPokemonBatch();
});