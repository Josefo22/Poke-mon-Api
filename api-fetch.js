const searchForm = document.getElementById('searchForm');
const pokemonInput = document.getElementById('pokemonInput');
const autocompleteSuggestions = document.getElementById('autocompleteSuggestions');
const pokemonInfo = document.getElementById('pokemonInfo');
const pokemonName = document.getElementById('pokemonName');
const pokemonLife = document.getElementById('pokemonLife');
const pokemonImage = document.getElementById('pokemonImage');
const pokemonAbilities = document.getElementById('pokemonAbilities');

let allPokemonNames = [];

// Fetch all Pokémon names when the page loads
fetchAllPokemonNames();

async function fetchAllPokemonNames() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118'); 
    const data = await response.json();
    allPokemonNames = data.results.map(pokemon => pokemon.name);
  } catch (error) {
    console.error('Error fetching Pokémon names:', error);
  }
}

pokemonInput.addEventListener('input', function () {
  const inputValue = pokemonInput.value.toLowerCase();

  
  if (inputValue.length >= 3) {
    const suggestions = getPokemonSuggestions(inputValue);
    displayAutocompleteSuggestions(suggestions);
  } else {
    autocompleteSuggestions.innerHTML = '';
  }
});

searchForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const pokemonIdOrName = pokemonInput.value.toLowerCase();
  const pokemonData = await getPokemonData(pokemonIdOrName);

  if (pokemonData) {
    displayPokemonInfo(pokemonData);
  } else {
    alert('Pokemon no encontrado.');
  }
});

async function getPokemonData(idOrName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
    const pokemon = await response.json();
    return pokemon;
  } catch (error) {
    console.error('Error al obtener datos de Pokémon:', error);
    return null;
  }
}

function getPokemonSuggestions(input) {
  return allPokemonNames.filter(pokemon => pokemon.includes(input));
}

function displayAutocompleteSuggestions(suggestions) {
  autocompleteSuggestions.innerHTML = '';

  if (suggestions.length > 0) {
    suggestions.forEach(suggestion => {
      const suggestionElement = document.createElement('div');
      suggestionElement.textContent = suggestion;
      suggestionElement.addEventListener('click', function () {
        pokemonInput.value = suggestion;
        autocompleteSuggestions.innerHTML = '';
      });
      autocompleteSuggestions.appendChild(suggestionElement);
    });
    autocompleteSuggestions.style.display = 'block';
  } else {
    autocompleteSuggestions.style.display = 'none';
  }
}

document.getElementById('searchAnother').addEventListener('click', function () {
    // Limpiar la información y mostrar el formulario nuevamente
    pokemonInfo.classList.add('hidden');
    pokemonInput.value = '';
    autocompleteSuggestions.innerHTML = '';
  });

function displayPokemonInfo(pokemon) {
    pokemonName.textContent = pokemon.name.toUpperCase();
    pokemonImage.src = pokemon.sprites.front_default;
  
    // Displaying additional details
    const abilities = pokemon.abilities.map(ability => ability.ability.name);
    const types = pokemon.types.map(type => type.type.name);
    const stats = pokemon.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`);
    const weight = pokemon.weight / 10; // Convert decigrams to kilograms
    const height = pokemon.height / 10; // Convert decimeters to meters
  
    pokemonAbilities.textContent = `Habilidades: ${abilities.join(', ')}`;
    pokemonInfo.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      <p>Nombre: ${pokemon.name.toUpperCase()}</p>
      <p>Tipo(s): ${types.join(', ')}</p>
      <p>Estadísticas:</p>
      <ul>
        ${stats.map(stat => `<li>${stat}</li>`).join('')}
      </ul>
      <p>Peso: ${weight} kg</p>
      <p>Altura: ${height} m
    `;
  
    pokemonInfo.classList.remove('hidden');
    autocompleteSuggestions.style.display = 'none';
  }