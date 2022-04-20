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
var $customizeNature = document.querySelector('#customize-nature');
var $customizeMove1 = document.querySelector('#customize-move1');
var $customizeMove2 = document.querySelector('#customize-move2');
var $customizeMove3 = document.querySelector('#customize-move3');
var $customizeMove4 = document.querySelector('#customize-move4');
var $customizeForm = document.querySelector('#customize-pokemon');
var $typeDisplay = document.querySelectorAll('.type-display');
var $modal = document.querySelector('#modal');
var $newTeamName = document.querySelector('#new-team-name');
var $teamListDisplay = document.querySelector('#team-list-display');

$searchBar.addEventListener('click', dropDownSearch);
$searchButton.addEventListener('click', handleSearch);
$pokemonDisplay.addEventListener('click', handleDisplayClick);
$customizeMove1.addEventListener('focusout', showNextMove);
$customizeMove2.addEventListener('focusout', showNextMove);
$customizeMove3.addEventListener('focusout', showNextMove);
$customizeForm.addEventListener('submit', savePokemon);
$newTeamName.addEventListener('focusout', makeTeam);
$teamListDisplay.addEventListener('click', handleTeamclicked);

var xhrGen1 = new XMLHttpRequest();
xhrGen1.open('GET', 'https://pokeapi.co/api/v2/generation/1');
xhrGen1.responseType = 'json';
xhrGen1.addEventListener('load', handleXHR);
// xhrGen1.send();

function handleTeamclicked(event) {
  var target = event.target.parentElement;
  if (!target.hasAttribute('data-team')) {
    return;
  }
  for (var i = 0; i < data.team.length; i++) {
    if (data.team[i].name === target.getAttribute('data-team')) {
      data.team[i].addMember(data.currentPokemon);
      $modal.classList.add('hidden');
      data.currentPokemon = null;
      break;
    }
  }
}

function makeTeam(event) {
  if (event.target.value === '') {
    return;
  }
  var newTeam = new Team(event.target.value);
  event.target.value = '';
  data.team.push(newTeam);
  getTeamList(data.team);
}

function savePokemon(event) {
  event.preventDefault();
  var name = $customizePName.textContent;
  var ability = $customizeForm.ability.value;
  var item = $customizeForm.item.value;
  var nature = $customizeForm.nature.value;
  var move = [$customizeForm.move1.value, $customizeForm.move2.value, $customizeForm.move3.value, $customizeForm.move4.value];
  data.currentPokemon = new Pokemon(name, ability, item, nature, move);
  $modal.classList.remove('hidden');
}

function showNextMove(event) {
  var next = document.querySelector('.' + event.target.getAttribute('id'));
  next.classList.remove('hidden');
}

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
  var xhrNature = new XMLHttpRequest();
  xhrNature.open('GET', 'https://pokeapi.co/api/v2/nature?limit=30');
  xhrNature.responseType = 'json';
  xhrNature.addEventListener('load', loadNaturelist);
  xhrNature.send();
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
  for (var moveIndex = 0; moveIndex < response.moves.length; moveIndex++) {
    var $moveOption = document.createElement('option');
    $moveOption.textContent = response.moves[moveIndex].move.name[0].toUpperCase() + response.moves[moveIndex].move.name.slice(1);
    $moveOption.value = response.moves[moveIndex].move.name;
    var $moveOption1 = $moveOption.cloneNode(true);
    var $moveOption2 = $moveOption.cloneNode(true);
    var $moveOption3 = $moveOption.cloneNode(true);
    var $moveOption4 = $moveOption.cloneNode(true);
    $customizeMove1.appendChild($moveOption1);
    $customizeMove2.appendChild($moveOption2);
    $customizeMove3.appendChild($moveOption3);
    $customizeMove4.appendChild($moveOption4);
  }
  data.currentType = response.types;
  loadCurrentType(data.currentType);
}

function loadNaturelist(event) {
  var response = event.target.response.results;
  for (var natureIndex = 0; natureIndex < response.length; natureIndex++) {
    var $natureOption = document.createElement('option');
    $natureOption.textContent = response[natureIndex].name[0].toUpperCase() + response[natureIndex].name.slice(1);
    $natureOption.value = response[natureIndex].name;
    $customizeNature.appendChild($natureOption);
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

function getTeamList(array) {
  // <div class="text-center">
  //   <i class="fas fa-circle-plus center-width"></i>
  //   <input id="new-team-name" type="text" class="font-10 blend center-width" placeholder="Create New Team">
  // </div>
  while ($teamListDisplay.childElementCount > 1) {
    $teamListDisplay.removeChild($teamListDisplay.lastChild);
  }
  for (var i = 0; i < array.length; i++) {
    var $teamDiv = document.createElement('div');
    var $plusIcon = document.createElement('i');
    var $teamName = document.createElement('button');

    $teamName.className = 'font-10 blend text-left';
    $plusIcon.className = 'fas fa-circle-plus center-width';
    $teamDiv.className = 'flex margin-top-10';
    $teamDiv.setAttribute('data-team', array[i].name);
    $teamName.textContent = array[i].name;

    $teamDiv.append($plusIcon, $teamName);
    $teamListDisplay.appendChild($teamDiv);
  }
}

function loadCurrentType(array) {
  for (var i = 0; i < array.length; i++) {
    $typeDisplay[i].setAttribute('src', '/images/type/' + array[i].type.name + '.png');
  }
  if (array.length < $typeDisplay.length) {
    $typeDisplay[1].classList.add('hidden');
  } else {
    $typeDisplay[1].classList.remove('hidden');
  }
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

function Pokemon(name, ability, item, nature, moveArray) {
  this.name = name;
  this.ability = ability;
  this.item = item;
  this.move = moveArray;
}

function Team(name) {
  this.name = name;
  this.members = [];
}

Team.prototype.isFull = function () {
  return this.members.length >= 6;
};

Team.prototype.addMember = function (member) {
  this.members.push(member);
};
