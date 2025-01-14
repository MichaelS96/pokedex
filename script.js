let currentIndex = 1;
const limit = 22;
let allPokemons = [];
let pokedex, loadButton, loadingImg, modal, modalContent, searchInput;

function renderPokedex() {
    pokedex = document.getElementById('pokedex');
    loadButton = document.getElementById('loadButton');
    loadingImg = document.getElementById('loading');
    modal = document.getElementById('pokemonModal');
    modalContent = document.getElementById('pokemonModalContent');
    searchInput = document.getElementById('searchInput');

    loadButton.onclick = getPokemons;
    getPokemons();
}

async function getPokemons() {
    try {
        loadingImg.style.display = 'block';
        loadButton.disabled = true;

        const end = currentIndex + limit - 1;

        for (let i = currentIndex; i <= end; i++) {
            if (i > 151) break;

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const pokemonData = await response.json();
            allPokemons.push(pokemonData);
            createPokemonCard(pokemonData);

            await delay(150);
        }

        currentIndex += limit;
    } finally {
        loadingImg.style.display = 'none';
        loadButton.disabled = false;
    }
}

function filterPokemons() {
    const searchQuery = searchInput.value.toLowerCase();

    if (searchQuery.length < 3) {
        pokedex.innerHTML = '';
        for (let i = 0; i < allPokemons.length; i++) {
            createPokemonCard(allPokemons[i]);
        }
        return;
    }

    const filteredPokemons = [];

    for (let i = 0; i < allPokemons.length; i++) {
        if (allPokemons[i].name.toLowerCase().includes(searchQuery)) {
            filteredPokemons.push(allPokemons[i]);
        }
    }

    pokedex.innerHTML = '';
    for (let i = 0; i < filteredPokemons.length; i++) {
        createPokemonCard(filteredPokemons[i]);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    card.style.backgroundColor = typeColors[pokemon.types[0].type.name] || '#FFF';

    const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    const pokemonHTML = pokemonTemplates(pokemon, formattedName);

    card.innerHTML = pokemonHTML;

    card.onclick = () => openCard(pokemon);

    pokedex.appendChild(card);
}

function closeModal() {
    modal.style.display = 'none';
}

async function getMoves(pokemon) {
    const moves = pokemon.moves.slice(0, 4);

    const moveData = await Promise.all(
        moves.map(async (move) => {
            const response = await fetch(move.move.url);
            const moveDetails = await response.json();
            const power = moveDetails.power || '0';
            return {
                name: move.move.name,
                power: power
            };
        })
    );

    return moveData;
}

function switchTab(tabId) {
    const contents = Array.from(document.getElementsByClassName('tab-content'));
    contents.forEach(content => content.classList.add('hidden'));

    document.getElementById(tabId).classList.remove('hidden');
}

function showNextPokemon() {
    currentPokemonIndex = currentPokemonIndex + 1;

    if (currentPokemonIndex < 0) {
        currentPokemonIndex = allPokemons.length + 1;
    }

    const nextPokemon = allPokemons[currentPokemonIndex];
    openCard(nextPokemon);
}

function showPreviousPokemon() {
    currentPokemonIndex = currentPokemonIndex - 1;

    if (currentPokemonIndex < 0) {
        currentPokemonIndex = allPokemons.length - 1;
    }

    const previousPokemon = allPokemons[currentPokemonIndex];
    openCard(previousPokemon);
}