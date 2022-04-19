var $searchBar = document.querySelector('#search-bar');
var $searchFilter = document.querySelector('#search-filters');
var $pokemonDisplay = document.querySelector('#pokemon-display');

$searchBar.addEventListener('click', handleClick);

function handleClick(event) {
  $searchFilter.classList.toggle('hidden');
}

var xhrGen1 = new XMLHttpRequest();
xhrGen1.open('GET', 'https://pokeapi.co/api/v2/generation/1');
xhrGen1.responseType = 'json';
// xhrGen1.addEventListener('load', getlink(xhrGen1.response.pokemon_species));
xhrGen1.send();

// var xhrPokemon = new XMLHttpRequest();
// xhrPokemon.open('GET', 'https://pokeapi.co/api/v2/pokemon/dragonite');
// xhrPokemon.responseType = 'json';
// xhrPokemon.send();

function getlink(array) {
  if (array[0].url === undefined) {
    return;
  }
  for (var i = 0; i < array.length; i++) {
    createDiv(array[i].url);
  }
}

function createDiv(pokemonLink) {

  //  <div class="col-third display-top-space">
  //     <div class="pokemon-head center-width flex">
  //       <img src="images/Poké_Ball_icon.svg.png" class="width-fourth">
  //       <h3 class="font-10">Bulbasaur</h3>
  //     </div>
  //     <div class="pokemon-body center-width">
  //       <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png">
  //     </div>
  //   </div >
  var xhrPokemon = new XMLHttpRequest();
  xhrPokemon.open('GET', pokemonLink);
  xhrPokemon.send();
  var response = xhrPokemon.response;

  var $col = document.createElement('div');
  var $head = document.createElement('div');
  var $body = document.createElement('div');
  var $icon = document.createElement('img');
  var $image = document.createElement('img');
  var $h3 = document.createElement('h3');

  $col.className = 'col-third display-top-space';
  $head.className = 'pokemon-head center-width flex';
  $body.className = 'pokemon-body center-width';
  $icon.className = 'width-fourth';
  $icon.setAttribute('src', 'images/Poké_Ball_icon.svg.png');
  $image.setAttribute('src', response.sprites.front_default);
  $h3.className = 'font-10';
  $h3.textContent = response.name;
  $col.appendChild($head);
  $col.appendChild($body);
  $head.appendChild($icon);
  $head.appendChild($h3);
  $body.appendChild($image);

  $pokemonDisplay.appendChild($col);

  return $col;
}

getlink();
