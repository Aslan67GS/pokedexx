const BASE_URL = "https://pokeapi.co/api/v2/";
let cachedPokemon = {};
let offset = 0;
let currentPokemonId = 1;
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

async function searchPokemon(){
    const value=document.getElementById("search").value.toLowerCase();
    const container=document.getElementById("pokemon-container");
    const btn=document.getElementById("load-more-btn");
    container.innerHTML=""; btn.style.display="none";
    if(value.length<3) return container.innerHTML=`<p>Please enter at least 3 letters</p>`;
    try{
        const data=await (await fetch(`${BASE_URL}pokemon?limit=100000`)).json();
        const results=data.results.filter(p=>p.name.includes(value));
        if(!results.length) return container.innerHTML=`<p>No Pokémon found</p>`;
        for(let i=0;i<Math.min(10,results.length);i++) renderPokemon(await fetchPokemon(results[i].name));
    }catch{container.innerHTML=`<p>Error loading Pokémon</p>`;}
}

function deleteSearch(){
    document.getElementById("search").value="";
    const container=document.getElementById("pokemon-container");
    const btn=document.getElementById("load-more-btn");
    container.innerHTML=""; offset=0;
    btn.style.display="block";
    loadPokemonBatch();
}

document.getElementById("load-more-btn")
    .addEventListener("click", loadPokemonBatch);

window.addEventListener("DOMContentLoaded", () => {
    loadPokemonBatch();
});

async function openOverlay(id) {
    const p = await fetchPokemon(id);
    const evoHTML = await fetchEvolutionChain(id);
    document.getElementById("overlay-content").innerHTML = overlayTemplate(p, evoHTML);
    document.getElementById("overlay").classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeOverlay() {
    document.getElementById("overlay").classList.add("hidden");
    document.body.style.overflow = "";
}

function showTab(tab) {
    const stats = document.getElementById('stats-tab');
    const evo = document.getElementById('evo-tab');
    stats.classList.toggle('hidden', tab !== 'stats');
    evo.classList.toggle('hidden', tab !== 'evo');
}

async function fetchEvolutionChain(id){
    try {
        const species = await (await fetch(`${BASE_URL}pokemon-species/${id}`)).json();
        const evoData = await (await fetch(species.evolution_chain.url)).json();
        let evoNames = [];
        let evo = evoData.chain;
        do {
            evoNames.push(evo.species.name);
            evo = evo.evolves_to[0];
        } while(evo);
        return evoNames.map(n=>`<p>${n.toUpperCase()}</p>`).join('');
    } catch {
        return '<p>No evolution data</p>';
    }
}

async function changePokemon(step){
    let newId = currentPokemonId + step;
    if(newId < 1) return;
    currentPokemonId = newId;
    const p = await fetchPokemon(newId);
    const evo = await fetchEvolutionChain(newId);
    document.getElementById("overlay-content").innerHTML = overlayTemplate(p, evo);
}