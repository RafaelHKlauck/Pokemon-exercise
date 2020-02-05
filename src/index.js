// DOM MANIPULATION
import "./styles.css";
import { searchingAllTypes } from "./pokemonTypes";
import { catchPokemonNames } from "./pokemonTypes";
import { handleError } from "./pokemonTypes";

async function main() {
  const allNamesDOM = document.querySelector(".pokeList");
  let html;
  const types = await searchingAllTypes();
  const pokemonsPromise = await catchPokemonNames().catch(handleError);
  const pokemonsFilter = await Promise.all(pokemonsPromise);
  const pokemons = pokemonsFilter.filter(x => x.id < 1000);

  renderTypeNames(types);

  function renderTypeNames(types) {
    const allTypesDOM = document.querySelector(".allTypes");
    // const pokemonsArray = pokemons.map(x => x.types);
    allNamesDOM.innerHTML = "";
    html = `Pokemons Types`;
    html += types.results
      // .map(x => `${x.name[0].toUpperCase()}${x.name.substring(1)}`)
      .map(generateTypesHTML)
      .join("");
    allTypesDOM.innerHTML = html;

    const pokemonTypesList = document.querySelectorAll(".pokemonTypesList");
    pokemonTypesList.forEach(btn => {
      btn.addEventListener("click", ev => {
        // filtra os pokemons pelo type
        const pokemonsTypesFilter = pokemons.filter(x =>
          x.types.includes(btn.dataset.type)
        );
        const pokemonNameUpperCase = `${btn.dataset.type[0].toUpperCase()}${btn.dataset.type.substring(
          1
        )}`;
        // chma renderPokemon passando os pokemons
        //  renderPokemns(pokemons, `Chosen Type: ${type}`)
        renderPokemon(
          pokemonsTypesFilter,
          `Chosen Type: ${pokemonNameUpperCase}`
        );
      });
    });

    function generateTypesHTML(type) {
      // const lower = type.toLowerCase();
      const pokTypesWithNumber = pokemons.filter(x =>
        x.types.includes(type.name)
      );
      return `
        <div class="pokemonTypesList" data-type="${type.name}">
          ${type.name[0].toUpperCase()}${type.name.substring(1)}(${
        pokTypesWithNumber.length
      })
        </div>`;
    }
  }

  function renderPokemon(pokemons, title = "") {
    let id;
    const buttonAndTitle = document.querySelector(".allTypes");
    buttonAndTitle.innerHTML = html;
    html = pokemons.map(addHTML).join("");
    allNamesDOM.innerHTML = html;
    html = `${title} <div><button class="back">Voltar</button></div>`;
    buttonAndTitle.innerHTML = html;

    const backButton = document.querySelectorAll(".back");
    backButton.forEach(x =>
      x.addEventListener("click", () => renderTypeNames(types))
    );

    const pokemonCry = document.querySelectorAll(".pokeImg");
    pokemonCry.forEach(x => {
      x.addEventListener("click", pokemonInfo);
    });

    function addHTML(poke) {
      id = poke.id.toString().padStart(3, "0");
      const x = `${poke.name[0].toUpperCase()}${poke.name.substring(1)} - ${
        poke.id
      }`;
      return `<div class="pokemonNamesList">${x}<img class="pokeImg"src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png"></div>`;
    }
  }

  async function pokemonInfo(ev) {
    //Encontrando o ID a partir da URL da imagem.
    const imgUrl = ev.target.src;
    const imgId = imgUrl
      .substring(imgUrl.lastIndexOf("/") + 1, imgUrl.lastIndexOf("."))
      .replace(/^0+/g, "");
    //Vendo se o imgID é igual ao ID de algum Pokemon do pokemons
    const pokemon = pokemons.find(x => x.id.toString() === imgId);
    //Função que entra na URL das habilidades
    const abilitiesPromises = pokemon.abilities.map(x =>
      searchingPokemonInfo(x)
    );
    const abilities = await Promise.all(abilitiesPromises);
    renderAbillityButtons(abilities, pokemon, imgUrl);

    async function searchingPokemonInfo(pokeAb) {
      const urlAbility = await fetch(pokeAb.ability.url);
      const abilities = await urlAbility.json();
      return abilities;
    }
  }

  function renderAbillityButtons(abilities, pokemon, imgUrl) {
    modalInner.innerHTML = `<div class="nameImg">${pokemon.name[0].toUpperCase()}${pokemon.name.substring(
      1
    )}:<img src="${imgUrl}"/></div>`;
    const abilitiesHTML = abilities.map(renderButtons).join("");
    modalInner.innerHTML += `<div class="habNames">Abilities:${abilitiesHTML}</div><div class="habEfects"></div>`;
    const habNames = document.querySelector(".habNames");
    const habEfects = document.querySelector(".habEfects");
    habEfects.style.display = "none";
    habNames.style.display = "block";
    modalOuter.classList.add("open");

    function renderButtons(hab) {
      return `<div class="buttons">${hab.name[0].toUpperCase()}${hab.name.substring(
        1
      )}</div>`;
    }

    const abilitiesButton = document.querySelectorAll(".buttons");
    abilitiesButton.forEach(x => x.addEventListener("click", abilitiesInfo));

    function abilitiesInfo(ev) {
      const abName = ev.target.innerText.toLowerCase();
      //Filtrar entre as habilidades, qual tem o nome que foi clicado
      const clickAbility = abilities.filter(x => x.name === abName);
      //Caminhp para chegar nas habilidades
      const abilityWay = clickAbility[0].effect_entries[0];
      const effect = abilityWay.effect;
      const shortEffect = abilityWay.short_effect;
      habNames.style.display = "none";
      habEfects.style.display = "block";
      habEfects.innerHTML = `<p><h2>Chosen Ability: ${
        ev.target.innerText
      }</h2></p><p>Effect: ${effect}</p> <p>Short Effect: ${shortEffect}</p> <button class="backToAb">Voltar</button>`;

      const backToAb = document.querySelector(".backToAb");
      backToAb.addEventListener("click", () => {
        habEfects.style.display = "none";
        habNames.style.display = "block";
        // renderAbillityButtons(abilities, pokemon, imgUrl);
      });
    }
  }

  const modalOuter = document.querySelector(".modal-outer");
  const modalInner = document.querySelector(".modal-inner");

  modalOuter.addEventListener("click", function(event) {
    const isOutside = !event.target.closest(".modal-inner");
    //debugger;
    if (isOutside) {
      modalOuter.classList.remove("open");
    }
  });

  const teclado = document.querySelector("#teclado");
  teclado.addEventListener("keyup", pokemonName);

  function pokemonName() {
    // filtra pelo que foi digitado
    const pokemonsTypesFilterKey = pokemons.filter(x =>
      x.name.includes(teclado.value.toLowerCase())
    );
    // chama a msm funcao passando os pokemons
    if (teclado.value === "") {
      renderTypeNames(types);
    } else {
      renderPokemon(pokemonsTypesFilterKey);
    }
  }
}

main();
