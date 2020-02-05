// API - REQUESTS / FILTROS

const API = "https://pokeapi.co/api/v2";

export async function searchingAllTypes() {
  const allTypes = await fetch(`${API}/type`);
  const types = await allTypes.json();
  return types;
}

export async function catchPokemonNames() {
  const catchNamesAndUrl = await fetch(`${API}/pokemon/?limit=1000&offset=0`);
  const pokemonNameAndUrl = await catchNamesAndUrl.json();
  const pokemonsInfosPromises = pokemonNameAndUrl.results.map(
    catchingPokemonInfo
  );
  const pokemonsInfos = await Promise.all(pokemonsInfosPromises);
  const pokemons = pokemonsInfos.map(x =>
    Object.assign({}, x, {
      types: x.types.map(y => y.type.name)
    })
  );
  return pokemons;
}

export async function catchingPokemonInfo(poke) {
  const catchInfoByName = await fetch(`${API}/pokemon/${poke.name}`);
  const pokeNameAndUrl = await catchInfoByName.json();
  return pokeNameAndUrl;
}

export function handleError(err) {
  console.log("OH NO!");
  console.log(err);
}
