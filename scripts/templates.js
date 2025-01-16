function pokemonCardTemplate({ id, formattedName, cardImage, typeIcons }) {
    return `
        <div><strong>#${id}</strong>
            <div class='pokemon-card-img'>${cardImage}</div>
            <h3>${formattedName}</h3>
            <div class="type-icons">${typeIcons}</div>
        </div>
    `;
}

function generatePokemonTemplate(pokemon, types, moves, formattedName) {
    return `
        <button onclick="closeModal()">
            <img src="assets/img/x.png" alt="Close" style="width: 20px; height: 20px;">
        </button>
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${formattedName}">
        <h2>${formattedName}</h2>
        <div class="tabs">
            <button class="tab-button" onclick="switchTab('main')">Main</button>
            <button class="tab-button" onclick="switchTab('stats')">Stats</button>
            <button class="tab-button" onclick="switchTab('attacks')">Attacks</button>
            <button class="tab-button-shiny" onclick="switchTab('shiny')">Shiny</button>
        </div>
        <div id="main" class="tab-content">
            <p>Height: ${pokemon.height / 10} m</p>
            <p>Weight: ${pokemon.weight / 10} kg</p>
            <p>Base Experience: ${pokemon.base_experience}</p>
            <p>Typ: ${types}</p>
        </div>
        <div id="stats" class="tab-content hidden">
            <p>HP: ${pokemon.stats[0].base_stat}</p>
            <p>Attack: ${pokemon.stats[1].base_stat}</p>
            <p>Defense: ${pokemon.stats[2].base_stat}</p>
            <p>Speed: ${pokemon.stats[5].base_stat}</p>
        </div>
        <div id="attacks" class="tab-content hidden">
            ${moves.map(move =>
                `<p>${move.name}: ${move.power} dmg</p>`
            ).join('')}
        </div>
        <div id="shiny" class="tab-content hidden">
            <img src="${pokemon.sprites.other['official-artwork'].front_shiny}" alt="Shiny ${formattedName}">
        </div>
        <div class="change-card">
            <button onclick="showPreviousPokemon()">&#9664;</button>
            <button onclick="showNextPokemon()">&#9654;</button>
        </div>
    `;
}

