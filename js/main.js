var $searchBar = document.querySelector('#search-bar');
var $searchFilter = document.querySelector('#search-filters');
var $pokemonDisplay = document.querySelector('#pokemon-display');
var $searchBarArrow = document.querySelector('#search-bar-arrow');
var $searchButton = document.querySelector('#search-button');
var $searchForm = document.querySelector('#search-form');
var $views = document.querySelectorAll('.view');
var $customizePName = document.querySelector('#customize-pname');
var $customizePImage = document.querySelector('#customize-pimage');
var $customizeAbility = document.querySelector('#customize-ability');

$searchBar.addEventListener('click', dropDownSearch);
$searchButton.addEventListener('click', handleSearch);
$pokemonDisplay.addEventListener('click', handleDisplayClick);

var xhrGen1 = new XMLHttpRequest();
xhrGen1.open('GET', 'https://pokeapi.co/api/v2/generation/1');
xhrGen1.responseType = 'json';
xhrGen1.addEventListener('load', handleXHR);
xhrGen1.send();

function handleDisplayClick(event) {
  var clickedelement = event.target.parentElement.parentElement;
  if (!clickedelement.hasAttribute('data-pokemon')) {
    return;
  }
  var xhrEdit = new XMLHttpRequest();
  xhrEdit.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + clickedelement.getAttribute('data-pokemon'));
  xhrEdit.responseType = 'json';
  xhrEdit.addEventListener('load', loadclickedPokemon);
  xhrEdit.send();
  data.view = 'customize';
  switchView(data.view);
}

function loadclickedPokemon(event) {
  var response = event.target.response;
  $customizePName.textContent = response.name[0].toUpperCase() + response.name.slice(1);
  $customizePImage.setAttribute('src', response.sprites.front_default);
  for (var abilityIndex = 0; abilityIndex < response.abilities.length; abilityIndex++) {
    if (response.abilities[abilityIndex].is_hidden) {
      continue;
    } else {
      var $abilityOption = document.createElement('option');
      $abilityOption.textContent = response.abilities[abilityIndex].ability.name[0].toUpperCase() + response.abilities[abilityIndex].ability.name.slice(1);
      $abilityOption.setAttribute('value', response.abilities[abilityIndex].ability.name);
      $customizeAbility.appendChild($abilityOption);
    }
  }
}

function dropDownSearch(event) {
  $searchFilter.classList.toggle('hidden');
  $searchBarArrow.classList.toggle('fa-angle-up');
  $searchBarArrow.classList.toggle('fa-angle-down');
}

function handleSearch(event) {
  event.preventDefault();
  dropDownSearch();
  while ($pokemonDisplay.firstChild) {
    $pokemonDisplay.removeChild($pokemonDisplay.firstChild);
  }
  if ($searchForm.name.value !== '') {
    sendRequest('https://pokeapi.co/api/v2/pokemon/' + $searchForm.name.value.toLowerCase());
  } else if ($searchForm.type.value !== '') {
    var xhrType = new XMLHttpRequest();
    xhrType.open('GET', 'https://pokeapi.co/api/v2/type/' + $searchForm.type.value);
    xhrType.responseType = 'json';
    xhrType.addEventListener('load', handleTypeSearch);
    xhrType.send();
  } else if ($searchForm.generation.value !== '') {
    var xhrGeneration = new XMLHttpRequest();
    xhrGeneration.open('GET', 'https://pokeapi.co/api/v2/' + $searchForm.generation.value);
    xhrGeneration.responseType = 'json';
    xhrGeneration.addEventListener('load', handleXHR);
    xhrGeneration.send();
  }
}

function handleTypeSearch(event) {
  var returnData = event.target.response;
  getlinkType(returnData.pokemon);
}

function handleXHR(event) {
  var returnData = event.target.response;
  getlinkGeneration(returnData.pokemon_species);
}

function loadCurrentPokemon(event) {
  $pokemonDisplay.appendChild(createDiv(event.target.response));
}

function switchView(view) {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-view') === view) {
      $views[i].classList.remove('hidden');
    } else {
      $views[i].classList.add('hidden');
    }
  }
}

function getlinkGeneration(array) {
  for (var i = 0; i < array.length; i++) {
    sendRequest('https://pokeapi.co/api/v2/pokemon/' + array[i].name);
  }
}

function getlinkType(array) {
  for (var i = 0; array.length > 1; i++) {
    sendRequest(array[i].pokemon.url);
  }
}

function sendRequest(url) {
  var xhrPokemon = new XMLHttpRequest();
  xhrPokemon.open('GET', url);
  xhrPokemon.responseType = 'json';
  xhrPokemon.addEventListener('load', loadCurrentPokemon);
  xhrPokemon.send();
}

function createDiv(obj) {

  //  <div class="col-third display-top-space">
  //     <div class="pokemon-head center-width flex">
  //       <img src="images/Poké_Ball_icon.svg.png" class="width-fourth">
  //       <h3 class="font-10">Bulbasaur</h3>
  //     </div>
  //     <div class="pokemon-body center-width">
  //       <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png">
  //     </div>
  //   </div >
  // var xhrPokemon = new XMLHttpRequest();
  // xhrPokemon.open('GET', pokemonLink);
  // xhrPokemon.send();
  // var response = xhrPokemon.response;

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
  $image.setAttribute('src', obj.sprites.front_default);
  $h3.className = 'font-10';
  $h3.textContent = obj.name[0].toUpperCase() + obj.name.slice(1);
  $col.setAttribute('data-pokemon', obj.name);
  $col.appendChild($head);
  $col.appendChild($body);
  $head.appendChild($icon);
  $head.appendChild($h3);
  $body.appendChild($image);

  return $col;
}
