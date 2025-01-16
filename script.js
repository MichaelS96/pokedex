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
        resetPokemons();
    } else {
        displayFilteredPokemons();
    }
}

function resetPokemons() {
    const noResults = document.getElementById('noResults');
    const loadButton = document.getElementById('loadButton');

    noResults.style.display = 'none';
    loadButton.disabled = false;
    pokedex.innerHTML = '';

    allPokemons.forEach(createPokemonCard);
}

function displayFilteredPokemons() {
    const filteredPokemons = filterPokemonsByQuery();
    const noResults = document.getElementById('noResults');
    const loadButton = document.getElementById('loadButton');

    pokedex.innerHTML = '';

    if (filteredPokemons.length === 0) {
        noResults.style.display = 'flex';
        loadButton.disabled = true;
    } else {
        noResults.style.display = 'none';
        loadButton.disabled = true;
        filteredPokemons.forEach(createPokemonCard);
    }
}

function filterPokemonsByQuery() {
    return allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchInput.value.toLowerCase()));
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.style.background = getPokemonGradient(pokemon.types, typeColors);
    const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    card.innerHTML = pokemonTemplates(pokemon, formattedName);
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

    if (currentPokemonIndex >= allPokemons.length) {
        currentPokemonIndex = 0;
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

function getPokemonGradient(types, typeColors) {
    const colors = [];
    for (let i = 0; i < types.length; i++) {
        const typeName = types[i].type.name;
        const color = typeColors[typeName] || '#FFF';
        colors.push(color);
    }

    if (colors.length > 1) {
        return `linear-gradient(80deg, ${colors.join(', ')})`;
    }
    return colors[0];
}

function pokemonTemplates(pokemon, formattedName) {
    const cardImage = `<img src="${pokemon.sprites.front_default}" alt="${formattedName}">`;

    let typeIcons = '';
    for (let i = 0; i < pokemon.types.length; i++) {
        const type = pokemon.types[i].type.name;
        const typeIcon = typeImages[type] || 'assets/img/typenpokemon/default.png';
        typeIcons += `<img src="${typeIcon}" alt="${type}" class="type-icon">`;
    }

    return pokemonCardTemplate({
        id: pokemon.id,
        formattedName,
        cardImage,
        typeIcons
    });
}

async function openCard(pokemon) {
    modal.style.display = 'flex';
    modalContent.style.background = getPokemonGradient(pokemon.types, typeColors);
    const moves = await getMoves(pokemon);

    const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    let types = '';
    for (let i = 0; i < pokemon.types.length; i++) {
        types += pokemon.types[i].type.name;
        if (i < pokemon.types.length - 1) {
            types += ', ';
        }
    }
    modalContent.innerHTML = generatePokemonTemplate(pokemon, types, moves, formattedName);

    currentPokemonIndex = allPokemons.findIndex(p => p.id === pokemon.id);
}