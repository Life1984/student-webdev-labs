const pokemonColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#ea7ce8',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

//Corrected pathway
const LOADER_IMAGE = 'images/loader.gif';

//Select the existing elements from 04-fetch.html
const navbar = document.querySelector('.navbar');
const pokemonContainer = document.querySelector('#pokemon-container');

//Store fetched Pokemon so search can filter locally
let allPokemons = [];

//Used to cancel the previous search delay when the user keeps typing
let searchTimeoutId = null;

//These short delays make the loader visible on fast connections
const INITIAL_LOADER_TIME = 800;
const SEARCH_LOADER_TIME = 300;

//Create the search input with JavaScript
const searchBox = document.createElement('input');
searchBox.classList.add('search-box');
searchBox.type = 'search';
searchBox.placeholder = 'Loading Pokémon...';
searchBox.setAttribute('aria-label', 'Search Pokémon');
searchBox.disabled = true;

//Add the search box to the navbar.
navbar.appendChild(searchBox);

//Promise-based timer for the loading screens.
const wait = function (milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

//Dallback behavior to the loader image.
const watchLoaderImage = function () {
  const loaderGif = pokemonContainer.querySelector('.loader-gif');

  if (!loaderGif) {
    return;
  }

  loaderGif.addEventListener('error', function () {
    loaderGif.classList.add('is-missing');
    loaderGif.style.display = 'none';
  });
};

//Show either the initial fetching loader or the search loader.
const showLoader = function (message = 'Fetching data...') {
  pokemonContainer.innerHTML = `
    <div class="loader-wrapper">
      <img class="loader-gif" src="${LOADER_IMAGE}" alt="Loading Pokémon" />
      <div class="loader-spinner" aria-hidden="true"></div>
      <p>${message}</p>
    </div>
  `;

  watchLoaderImage();
};

//Capitalize the first letter of a Pokemon name or type.
const capitalize = function (word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

//Create one Pokemon card.
const createPokemonCard = function (pokemon) {
  const card = document.createElement('article');
  card.classList.add('pokemon-card');

  //Allows keyboard users to focus the card and see the same visual effect
  card.tabIndex = 0;

  const image = document.createElement('img');

  //Prefer official artwork, then fall back to the default sprite.
  image.src =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;

  image.alt = capitalize(pokemon.name);

  const name = document.createElement('h2');
  name.textContent = capitalize(pokemon.name);

  const typeContainer = document.createElement('div');
  typeContainer.classList.add('type-container');

  //Add one colored badge for each type.
  pokemon.types.forEach((typeInfo) => {
    const typeName = typeInfo.type.name;

    const typeBadge = document.createElement('span');
    typeBadge.classList.add('type-badge');
    typeBadge.textContent = capitalize(typeName);
    typeBadge.style.backgroundColor = pokemonColors[typeName] || '#777777';

    typeContainer.appendChild(typeBadge);
  });

  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(typeContainer);

  return card;
};

//Display Pokemon cards or a no-results message
const displayPokemons = function (pokemonsToDisplay) {
  pokemonContainer.innerHTML = '';

  if (pokemonsToDisplay.length === 0) {
    const message = document.createElement('p');
    message.classList.add('no-results');
    message.textContent = 'No Pokémon matched your search.';

    pokemonContainer.appendChild(message);
    return;
  }

  pokemonsToDisplay.forEach((pokemon) => {
    pokemonContainer.appendChild(createPokemonCard(pokemon));
  });
};

//Fetch the first 25 Pokemon from the PokeAPI
const fetchPokemons = async function () {
  showLoader('Fetching data...');

  try {
    const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=25');

    if (!listResponse.ok) {
      throw new Error('Could not fetch the Pokemon list.');
    }

    const listData = await listResponse.json();

    //Fetch detailed data for each Pokemon so cards can show images and types
    const pokemonRequests = listData.results.map((pokemon) => fetch(pokemon.url));
    const pokemonResponses = await Promise.all(pokemonRequests);

    const pokemonDetails = await Promise.all(
      pokemonResponses.map((response) => {
        if (!response.ok) {
          throw new Error('Could not fetch Pokemon details.');
        }

        return response.json();
      })
    );

    //Sort by ID so the first 25 appear in normal Pokedex order
    allPokemons = pokemonDetails.sort((a, b) => a.id - b.id);

    //Keep the loading GIF visible briefly for the assignment screenshot
    await wait(INITIAL_LOADER_TIME);

    displayPokemons(allPokemons);

    //Enable searching only after Pokemon data exists
    searchBox.disabled = false;
    searchBox.placeholder = 'Search Pokémon...';
  } catch (error) {
    pokemonContainer.innerHTML = '';

    const message = document.createElement('p');
    message.classList.add('no-results');
    message.textContent = 'Something went wrong while fetching Pokémon.';

    pokemonContainer.appendChild(message);
  }
};

//Filter Pokemon by name or type.
const searchPokemons = function (searchQuery) {
  return allPokemons.filter((pokemon) => {
    const nameMatches = pokemon.name.toLowerCase().includes(searchQuery);

    const typeMatches = pokemon.types.some((typeInfo) =>
      typeInfo.type.name.toLowerCase().includes(searchQuery)
    );

    return nameMatches || typeMatches;
  });
};

//Show a brief loader whilst returning search results
searchBox.addEventListener('input', function (event) {
  const searchQuery = event.target.value.trim().toLowerCase();

  clearTimeout(searchTimeoutId);

  showLoader('Searching...');

  searchTimeoutId = setTimeout(function () {
    const pokemonsToDisplay =
      searchQuery === '' ? allPokemons : searchPokemons(searchQuery);

    displayPokemons(pokemonsToDisplay);
  }, SEARCH_LOADER_TIME);
});

//Attach fallback behavior to the initial HTML loader, then start the app
watchLoaderImage();
fetchPokemons();
