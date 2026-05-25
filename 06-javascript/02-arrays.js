const pokemons = [
  { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'] },
  { id: 2, name: 'Ivysaur', types: ['Grass', 'Poison'] },
  { id: 3, name: 'Venusaur', types: ['Grass', 'Poison'] },
  { id: 4, name: 'Charmander', types: ['Fire'] },
  { id: 5, name: 'Charmeleon', types: ['Fire'] },
  { id: 6, name: 'Charizard', types: ['Fire', 'Flying'] },
  { id: 7, name: 'Squirtle', types: ['Water'] },
  { id: 8, name: 'Wartortle', types: ['Water'] },
  { id: 9, name: 'Blastoise', types: ['Water'] },
  { id: 10, name: 'Caterpie', types: ['Bug'] },
  { id: 11, name: 'Metapod', types: ['Bug'] },
  { id: 12, name: 'Butterfree', types: ['Bug', 'Flying'] },
  { id: 13, name: 'Weedle', types: ['Bug', 'Poison'] },
  { id: 14, name: 'Kakuna', types: ['Bug', 'Poison'] },
  { id: 15, name: 'Beedrill', types: ['Bug', 'Poison'] },
  { id: 16, name: 'Pidgey', types: ['Normal', 'Flying'] },
  { id: 17, name: 'Pidgeotto', types: ['Normal', 'Flying'] },
  { id: 18, name: 'Pidgeot', types: ['Normal', 'Flying'] },
  { id: 19, name: 'Rattata', types: ['Normal'] },
  { id: 20, name: 'Raticate', types: ['Normal'] },
];

const forEachPokemon = function () {
  // Create an array to hold each formatted Pokemon string
  const pokemonList = [];

  // Use forEach().
  pokemons.forEach((pokemon) => {
    pokemonList.push(
      `#${pokemon.id} ${pokemon.name} - ${pokemon.types.join(' / ')}`
    );
  });

  // Join the array with new lines 
  return pokemonList.join('\n');
};

const filterPokemons = function (type) {
  // Convert the searched type to lowercase so matching is case-insensitive
  const searchType = type.toLowerCase();

  return pokemons
    .filter((pokemon) =>
      pokemon.types.some(
        (pokemonType) => pokemonType.toLowerCase() === searchType
      )
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((pokemon) => pokemon.name);
};

const searchPokemons = function (query) {
  // Convert the search query to lowercase so matching is case-insensitive
  const searchQuery = query.toLowerCase();

  return pokemons.filter((pokemon) => {
    const nameMatches = pokemon.name.toLowerCase().includes(searchQuery);

    const typeMatches = pokemon.types
      .map((type) => type.toLowerCase())
      .includes(searchQuery);

    return nameMatches || typeMatches;
  });
};

const reducePokemons = pokemons.reduce((typeCounts, pokemon) => {
  // Count every type attached to each Pokemon
  pokemon.types.forEach((type) => {
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  return typeCounts;
}, {});

console.log(forEachPokemon());
console.log(filterPokemons('Fire'));
console.log(filterPokemons('Normal'));
console.log(filterPokemons('Poison'));
console.log(searchPokemons('Wartortle'));
console.log(searchPokemons('pidgey'));
console.log(searchPokemons('bug'));
console.log(reducePokemons);
