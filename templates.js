function pokemonTemplates(pokemon, formattedName) {
    const cardImage = `<img src="${pokemon.sprites.front_default}" alt="${formattedName}">`;

    const typeIcons = pokemon.types.map(t => {
        const typeIcon = typeImages[t.type.name] || 'assets/img/typenpokemon/default.png';
        return `<img src="${typeIcon}" alt="${t.type.name}" class="type-icon">`;
    }).join('');

    return `
        <div><strong>#${pokemon.id}</strong>
            <div class='pokemon-card-img'>${cardImage}</div>
            <h3>${formattedName}</h3>
            <div class="type-icons">${typeIcons}</div>
        </div>
    `;
}

async function openCard(pokemon) {
    modal.style.display = 'flex';
    modalContent.style.backgroundColor = typeColors[pokemon.types[0].type.name] || '#FFF';
    const moves = await getMoves(pokemon);
    const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    modalContent.innerHTML = `
        <button onclick="closeModal()">
            <img src="assets/img/x.png" alt="Close" style="width: 20px; height: 20px;">
        </button>
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${formattedName}">
        <h2>${formattedName}</h2>
        <div class="tabs">
            <button class="tab-button" onclick="switchTab('main')">Main</button>
            <button class="tab-button" onclick="switchTab('stats')">Stats</button>
            <button class="tab-button" onclick="switchTab('attacks')">Attacks</button>
        </div>
        <div id="main" class="tab-content">
            <p>Height: ${pokemon.height / 10} m</p>
            <p>Weight: ${pokemon.weight / 10} kg</p>
            <p>Base Experience: ${pokemon.base_experience}</p>
        </div>
        <div id="stats" class="tab-content hidden">
            <p>HP: ${pokemon.stats[0].base_stat}</p>
            <p>Attack: ${pokemon.stats[1].base_stat}</p>
            <p>Defense: ${pokemon.stats[2].base_stat}</p>
            <p>Speed: ${pokemon.stats[5].base_stat}</p>
        </div>
        <div id="attacks" class="tab-content hidden">
            ${moves.map(move => `
                <p>${move.name}: ${move.power || '0'} dmg</p>
            `).join('')}
        </div>
    `;
}


