const $searchBar = document.querySelector('#search-bar');
const $searchFilter = document.querySelector('#search-filters');
const $pokemonDisplay = document.querySelector('#pokemon-display');
const $searchBarArrow = document.querySelector('#search-bar-arrow');
const $searchButton = document.querySelector('#search-button');
const $searchForm = document.querySelector('#search-form');
const $views = document.querySelectorAll('.view');
const $customizePName = document.querySelector('#customize-pname');
const $customizePImage = document.querySelector('#customize-pimage');
const $customizeAbility = document.querySelector('#customize-ability');
const $customizeNature = document.querySelector('#customize-nature');
const $customizeMove1 = document.querySelector('#customize-move1');
const $customizeMove2 = document.querySelector('#customize-move2');
const $customizeMove3 = document.querySelector('#customize-move3');
const $customizeMove4 = document.querySelector('#customize-move4');
const $customizeForm = document.querySelector('#customize-pokemon');
const $typeDisplay = document.querySelectorAll('.type-display');
const $modal = document.querySelector('#modal');
const $newTeamName = document.querySelector('#new-team-name');
const $teamListDisplay = document.querySelector('#team-list-display');
const $moveList = document.querySelectorAll('.move');
const $navBar = document.querySelector('.nav-bar');
const $teamDisplay = document.querySelector('#team-display');
const $teamDetailDisplay = document.querySelector('#team-detail-display');
const $teamDetailAddPokemon = document.querySelector('#detail-add-pokemon');
const $deleteQuestion = document.querySelector('#delete-question');
const $deleteModal = document.querySelector('#delete-modal');
const $deleteModalNo = document.querySelector('#delete-modal-no');
const $deleteModalYes = document.querySelector('#delete-modal-yes');
const $deleteTeamModal = document.querySelector('#team-delete-modal');
const $deleteTeamNo = document.querySelector('#delete-team-no');
const $deleteTeamYes = document.querySelector('#delete-team-yes');
const $loadingSpinner = document.querySelector('#loading-spinner');
const $deleteTeamQuestion = document.querySelector('#delete-team-question');

$searchBar.addEventListener('click', dropDownSearch);
$searchButton.addEventListener('click', handleSearch);
$pokemonDisplay.addEventListener('click', handleDisplayClick);
$customizeMove1.addEventListener('focusout', showNextMove);
$customizeMove2.addEventListener('focusout', showNextMove);
$customizeMove3.addEventListener('focusout', showNextMove);
$customizeForm.addEventListener('submit', savePokemon);
$newTeamName.addEventListener('focusout', makeTeam);
$teamListDisplay.addEventListener('click', handleTeamclicked);
$navBar.addEventListener('click', changeView);
$teamDisplay.addEventListener('click', handleTeamDisplayClick);
$teamDetailAddPokemon.addEventListener('click', changeView);
$deleteModalNo.addEventListener('click', closeDeleteModal);
$deleteModalYes.addEventListener('click', deletePokemon);
$deleteTeamNo.addEventListener('click', closeDeleteTeamModal);
$deleteTeamYes.addEventListener('click', deleteTeam);

const xhrGen1 = new XMLHttpRequest();
xhrGen1.open('GET', 'https://pokeapi.co/api/v2/generation/1');
xhrGen1.responseType = 'json';
xhrGen1.addEventListener('load', handleXHR);
xhrGen1.send();
$loadingSpinner.classList.remove('hidden');

function handleTeamDisplayClick(event) {
  if (!event.target.parentElement.hasAttribute('data-team')) {
    return;
  }
  if (event.target.hasAttribute('data-delete-team')) {
    $deleteTeamModal.classList.remove('hidden');
    data.editing = event.target.getAttribute('data-delete-team');
    $deleteTeamQuestion.textContent = 'Would you like to delete ' + event.target.getAttribute('data-delete-team') + ' ?';
  }
  if (event.target.hasAttribute('data-team')) {
    for (let i = 0; i < data.team.length; i++) {
      if (data.team[i].name === event.target.parentElement.getAttribute('data-team')) {
        switchView('team-detail');
        $teamDetailAddPokemon.classList.add('hidden');
        while ($teamDetailDisplay.firstChild) {
          $teamDetailDisplay.removeChild($teamDetailDisplay.firstChild);
        }
        $teamDetailDisplay.appendChild(createDetailDiv(data.team[i]));
        if (data.team[i].members.length < 6) {
          $teamDetailAddPokemon.classList.remove('hidden');
        }
      }
    }
  }
}

function openDeleteModal(event) {
  $deleteModal.classList.remove('hidden');
  $deleteQuestion.textContent = 'Do you want to release ' + event.target.getAttribute('data-pokemon') + '?';
  for (let i = 0; i < data.team.length; i++) {
    if (data.team[i].name === event.target.getAttribute('data-team')) {
      data.editing = data.team[i];
      for (let j = 0; j < data.team[i].members.length; j++) {
        if (data.team[i].members[j].name === event.target.getAttribute('data-pokemon')) {
          data.currentPokemon = data.team[i].members[j];
          break;
        }
      }
    }
  }
}

function closeDeleteModal(event) {
  $deleteModal.classList.add('hidden');
}

function closeDeleteTeamModal(event) {
  $deleteTeamModal.classList.add('hidden');
}

function deleteTeam(event) {
  for (let i = 0; i < data.team.length; i++) {
    if (data.team[i].name === data.editing) {
      data.team.splice(i, 1);
    }
  }
  $deleteTeamModal.classList.add('hidden');
  clearTeam();
  loadTeam(data.team);
  clearTeamList();
  getTeamList(data.team);
}

function deletePokemon(event) {
  data.editing.removeMember(data.currentPokemon.name);
  $deleteModal.classList.add('hidden');
  resetTeam();
}

function changeView(event) {
  if (!event.target.parentElement.hasAttribute('data-view')) {
    return;
  }
  data.view = event.target.parentElement.getAttribute('data-view');
  switchView(data.view);
}

function handleTeamclicked(event) {
  const target = event.target.parentElement;
  if (!target.hasAttribute('data-team')) {
    return;
  }
  for (let i = 0; i < data.team.length; i++) {
    if (data.team[i].name === target.getAttribute('data-team')) {
      data.team[i].addMember(data.currentPokemon);
      $modal.classList.add('hidden');
      data.currentPokemon = null;
      data.view = 'team';
      $customizeForm.reset();
      switchView(data.view);
      clearTeam();
      loadTeam(data.team);
      for (let j = 0; j < $moveList.length; j++) {
        $moveList[j].classList.add('hidden');
      }
      break;
    }
  }
}

function clearTeam() {
  while ($teamDisplay.firstChild) {
    $teamDisplay.removeChild($teamDisplay.firstChild);
  }
}

function resetCustomize() {
  while ($customizeAbility.children.length > 1) {
    $customizeAbility.removeChild($customizeAbility.lastChild);
  }
  while ($customizeNature.children.length > 1) {
    $customizeNature.removeChild($customizeNature.lastChild);
  }
  while ($customizeMove1.children.length > 1) {
    $customizeMove1.removeChild($customizeMove1.lastChild);
    $customizeMove2.removeChild($customizeMove2.lastChild);
    $customizeMove3.removeChild($customizeMove3.lastChild);
    $customizeMove4.removeChild($customizeMove4.lastChild);
  }
}

function makeTeam(event) {
  if (event.target.value === '') {
    return;
  }
  const newTeam = new Team(event.target.value);
  event.target.value = '';
  data.team.push(newTeam);
  clearTeamList();
  getTeamList(data.team);
}

function savePokemon(event) {
  event.preventDefault();
  const name = $customizePName.textContent;
  const ability = $customizeForm.ability.value;
  const item = $customizeForm.item.value;
  const nature = $customizeForm.nature.value;
  const move = [$customizeForm.move1.value, $customizeForm.move2.value, $customizeForm.move3.value, $customizeForm.move4.value];
  data.currentPokemon = new Pokemon(name, ability, item, nature, move);
  $modal.classList.remove('hidden');
}

function showNextMove(event) {
  const next = document.querySelector('.' + event.target.getAttribute('id'));
  next.classList.remove('hidden');
}

function handleDisplayClick(event) {
  const clickedelement = event.target.parentElement.parentElement;
  if (!clickedelement.hasAttribute('data-pokemon')) {
    return;
  }
  const xhrEdit = new XMLHttpRequest();
  xhrEdit.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + clickedelement.getAttribute('data-pokemon'));
  xhrEdit.responseType = 'json';
  xhrEdit.addEventListener('load', loadclickedPokemon);
  xhrEdit.send();
  const xhrNature = new XMLHttpRequest();
  xhrNature.open('GET', 'https://pokeapi.co/api/v2/nature?limit=30');
  xhrNature.responseType = 'json';
  xhrNature.addEventListener('load', loadNaturelist);
  xhrNature.send();
  data.view = 'customize';
  resetCustomize();
  switchView(data.view);
}

function loadclickedPokemon(event) {
  const response = event.target.response;
  $customizePName.textContent = response.name[0].toUpperCase() + response.name.slice(1);
  $customizePImage.setAttribute('src', response.sprites.front_default);
  for (let abilityIndex = 0; abilityIndex < response.abilities.length; abilityIndex++) {
    if (response.abilities[abilityIndex].is_hidden) {
      continue;
    } else {
      const $abilityOption = document.createElement('option');
      $abilityOption.textContent = response.abilities[abilityIndex].ability.name[0].toUpperCase() + response.abilities[abilityIndex].ability.name.slice(1);
      $abilityOption.setAttribute('value', response.abilities[abilityIndex].ability.name);
      $customizeAbility.appendChild($abilityOption);
    }
  }
  for (let moveIndex = 0; moveIndex < response.moves.length; moveIndex++) {
    const $moveOption = document.createElement('option');
    $moveOption.textContent = response.moves[moveIndex].move.name[0].toUpperCase() + response.moves[moveIndex].move.name.slice(1);
    $moveOption.value = response.moves[moveIndex].move.name;
    const $moveOption1 = $moveOption.cloneNode(true);
    const $moveOption2 = $moveOption.cloneNode(true);
    const $moveOption3 = $moveOption.cloneNode(true);
    const $moveOption4 = $moveOption.cloneNode(true);
    $customizeMove1.appendChild($moveOption1);
    $customizeMove2.appendChild($moveOption2);
    $customizeMove3.appendChild($moveOption3);
    $customizeMove4.appendChild($moveOption4);
  }
  data.currentType = response.types;
  loadCurrentType(data.currentType);
}

function loadNaturelist(event) {
  const response = event.target.response.results;
  for (let natureIndex = 0; natureIndex < response.length; natureIndex++) {
    const $natureOption = document.createElement('option');
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
  $loadingSpinner.classList.remove('hidden');
  event.preventDefault();
  dropDownSearch();
  while ($pokemonDisplay.firstChild) {
    $pokemonDisplay.removeChild($pokemonDisplay.firstChild);
  }
  if ($searchForm.name.value !== '') {
    sendRequest('https://pokeapi.co/api/v2/pokemon/' + $searchForm.name.value.toLowerCase());
  } else if ($searchForm.type.value !== '') {
    const xhrType = new XMLHttpRequest();
    xhrType.open('GET', 'https://pokeapi.co/api/v2/type/' + $searchForm.type.value);
    xhrType.responseType = 'json';
    xhrType.addEventListener('load', handleTypeSearch);
    xhrType.send();
  } else if ($searchForm.generation.value !== '') {
    const xhrGeneration = new XMLHttpRequest();
    xhrGeneration.open('GET', 'https://pokeapi.co/api/v2/' + $searchForm.generation.value);
    xhrGeneration.responseType = 'json';
    xhrGeneration.addEventListener('load', handleXHR);
    xhrGeneration.send();
  }
}

function handleTypeSearch(event) {
  const returnData = event.target.response;
  getlinkType(returnData.pokemon);
}

function handleXHR(event) {
  const returnData = event.target.response;
  getlinkGeneration(returnData.pokemon_species);
}

function loadCurrentPokemon(event) {
  $loadingSpinner.classList.add('hidden');
  $pokemonDisplay.appendChild(createDiv(event.target.response));
}

function resetTeam() {
  data.editing = null;
  data.currentPokemon = null;
  data.view = 'team';
  switchView(data.view);
  clearTeam();
  loadTeam(data.team);
}

function loadTeam(array) {
  // <div class="col-full">
  //   <div class="team-header text-center">
  //     <a class="white-text">Team Name</a>
  //     <i class="fas fa-trash-can delete-team-icon"></i>
  //   </div>
  //   <div class="team-body">
  //     <div class="">
  //       <div class="pokemon-head center-width flex">
  //         <img src="/images/Poké_Ball_icon.svg.png">
  //           <h3 class="font-10">Charizard</h3>
  //       </div>
  //       <div class="pokemon-body center-width">
  //         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png">
  //       </div>
  //     </div>
  //   </div>
  // </div>
  for (let i = 0; i < array.length; i++) {
    const $col = document.createElement('div');
    const $teamHead = document.createElement('div');
    const $teamBody = document.createElement('div');
    const $teamName = document.createElement('a');
    const $deleteTeamIcon = document.createElement('i');
    for (let j = 0; j < array[i].members.length; j++) {
      var $teamMember = createDiv(array[i].members[j]);
      $teamBody.appendChild($teamMember);
    }

    $col.className = 'col-full';
    $teamHead.className = 'team-header text-center padding-5 flex';
    $teamName.className = 'white-text center-width single-space';
    $teamBody.className = 'team-body flex flex-wrap flex-center';
    $teamName.textContent = array[i].name;
    $teamHead.setAttribute('data-team', array[i].name);
    $teamName.setAttribute('data-team', array[i].name);
    $deleteTeamIcon.className = 'fas fa-trash-can delete-team-icon';
    $deleteTeamIcon.setAttribute('data-delete-team', array[i].name);

    $col.append($teamHead, $teamBody);
    $teamHead.append($teamName, $deleteTeamIcon);
    $teamDisplay.appendChild($col);
  }
}

function clearTeamList() {
  while ($teamListDisplay.children.length > 1) {
    $teamListDisplay.removeChild($teamListDisplay.lastChild);
  }
}

function getTeamList(array) {
  // <div class="text-center">
  //   <i class="fas fa-circle-plus center-width"></i>
  //   <input id="new-team-name" type="text" class="font-10 blend center-width" placeholder="Create New Team">
  // </div>
  for (let i = 0; i < array.length; i++) {
    const $teamDiv = document.createElement('div');
    const $plusIcon = document.createElement('i');
    const $teamName = document.createElement('button');

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
  for (let i = 0; i < array.length; i++) {
    $typeDisplay[i].setAttribute('src', 'images/type/' + array[i].type.name + '.png');
  }
  if (array.length < $typeDisplay.length) {
    $typeDisplay[1].classList.add('hidden');
  } else {
    $typeDisplay[1].classList.remove('hidden');
  }
  data.currentType = [];
}

function switchView(view) {
  for (let i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-view') === view) {
      $views[i].classList.remove('hidden');
    } else {
      $views[i].classList.add('hidden');
    }
  }
}

function getlinkGeneration(array) {
  for (let i = 0; i < array.length; i++) {
    sendRequest('https://pokeapi.co/api/v2/pokemon/' + array[i].name);
  }
}

function getlinkType(array) {
  for (let i = 0; array.length > 1; i++) {
    sendRequest(array[i].pokemon.url);
  }
}

function sendRequest(url) {
  const xhrPokemon = new XMLHttpRequest();
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

  const $col = document.createElement('div');
  const $head = document.createElement('div');
  const $body = document.createElement('div');
  const $icon = document.createElement('img');
  const $image = document.createElement('img');
  const $h3 = document.createElement('h3');

  $col.className = 'col-third margin-top-30 link';
  $head.className = 'pokemon-head center-width flex';
  $body.className = 'pokemon-body center-width';
  $icon.className = 'width-fourth';
  $icon.setAttribute('src', 'images/Poké_Ball_icon.svg.png');
  $image.setAttribute('src', obj.sprites.front_default);
  $col.setAttribute('data-pokemon', obj.name);
  $h3.className = 'font-10';
  $h3.textContent = obj.name[0].toUpperCase() + obj.name.slice(1);
  $col.appendChild($head);
  $col.appendChild($body);
  $head.appendChild($icon);
  $head.appendChild($h3);
  $body.appendChild($image);

  return $col;
}

function createDetailDiv(obj) {
  // <div class="col-full">
  //   <div class="team-header text-center">
  //     <h3 class="white-text">Test</h3>
  //   </div>
  //   <div class="row width-90 center-width">
  //     <div class="col-half right-card">
  //       <div class="pokemon-head-clear center-width flex margin-top-10">
  //         <img class="width-fourth" src="images/Poké_Ball_icon.svg.png">
  //           <h3 class="font-10">Charizard</h3>
  //       </div>
  //       <div class="text-center">
  //         <img class="center-width" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png">
  //       </div>
  //       <div class="text-center">
  //         <img class="type-display icon" src="/images/type/flying.png">
  //           <img class="type-display icon" src="/images/type/fire.png">
  //           </div>
  //           <div class="text-center flex">
  //             <p class="font-10 detail-heading">Ability:</p>
  //             <p class="font-10"> Blaze</p>
  //           </div>
  //           <div class="text-center flex">
  //             <p class="font-10 detail-heading">Item:</p>
  //             <p class="font-10"> Leftovers</p>
  //           </div>
  //           <div class="text-center flex">
  //             <p class="font-10 detail-heading">Nature:</p>
  //             <p class="font-10"> Bold</p>
  //           </div>
  //       </div>
  //       <div class="col-half left-card">
  //         <div class="margin-top-30 text-center flex">
  //           <p class="font-10 detail-heading">Move 1:</p>
  //           <p class="font-10">Flamethrower</p>
  //         </div>
  //         <div class="margin-top-30 text-center flex">
  //           <p class="font-10 detail-heading">Move 2:</p>
  //           <p class="font-10">Fly</p>
  //         </div>
  //         <div class="margin-top-30 text-center flex">
  //           <p class="font-10 detail-heading">Move 3:</p>
  //           <p class="font-10">Body Slam</p>
  //         </div>
  //         <div class="margin-top-30 text-center flex">
  //           <p class="font-10 detail-heading">Move 4:</p>
  //           <p class="font-10">Cut</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  const $col = document.createElement('div');
  const $teamHead = document.createElement('div');
  const $teamName = document.createElement('h3');
  const $cardHolder = document.createElement('div');

  $col.className = 'col-full';
  $teamHead.className = 'team-header text-center margin-top-30 padding-5';
  $teamName.className = 'white-text single-space';
  $cardHolder.className = 'flex flex-wrap';

  $teamName.textContent = obj.name;

  $teamHead.appendChild($teamName);

  $col.append($teamHead, $cardHolder);

  for (let pokemonIndex = 0; pokemonIndex < obj.members.length; pokemonIndex++) {
    const $wholeCard = document.createElement('div');
    const $leftCard = createDiv(obj.members[pokemonIndex]);
    const $iconDiv = document.createElement('div');
    const $typeIcon1 = document.createElement('img');
    const $typeIcon2 = document.createElement('img');
    const $abilityDiv = document.createElement('div');
    const $ability = document.createElement('p');
    const $abilityName = document.createElement('p');
    const $itemDiv = document.createElement('div');
    const $item = document.createElement('p');
    const $itemName = document.createElement('p');
    const $natureDiv = document.createElement('div');
    const $nature = document.createElement('p');
    const $natureName = document.createElement('p');
    const $rightCard = document.createElement('div');
    const $deleteIconDiv = document.createElement('div');
    const $deleteIcon = document.createElement('i');
    for (let moveIndex = 0; moveIndex < obj.members[pokemonIndex].move.length; moveIndex++) {
      const $moveDiv = document.createElement('div');
      const $move = document.createElement('p');
      const $moveName = document.createElement('p');

      $moveDiv.className = 'text-center flex margin-top-30';
      $move.className = 'font-10 detail-heading';
      $moveName.className = 'font-10 margin-left-10';

      $move.textContent = 'Move ' + (moveIndex + 1) + ':';
      if (obj.members[pokemonIndex].move[moveIndex] === '') {
        $moveName.textContent = '';
      } else {
        $moveName.textContent = obj.members[pokemonIndex].move[moveIndex][0].toUpperCase() + obj.members[pokemonIndex].move[moveIndex].slice(1);
      }

      $moveDiv.append($move, $moveName);
      $rightCard.append($moveDiv);
    }

    $deleteIcon.className = 'fas fa-trash-can delete-icon';
    $deleteIconDiv.className = 'text-right padding-5';
    $wholeCard.className = 'row sml-width-90 center-width margin-top-30';
    $leftCard.className = 'col-half left-card';
    $iconDiv.className = 'text-center';
    $typeIcon1.className = 'type-display icon';
    $typeIcon2.className = 'type-display icon';
    $abilityDiv.className = 'text-center flex';
    $ability.className = 'font-10 detail-heading';
    $abilityName.className = 'font-10 margin-left-10';
    $itemDiv.className = 'text-center flex';
    $item.className = 'font-10 detail-heading';
    $itemName.className = 'font-10 margin-left-10';
    $natureDiv.className = 'text-center flex';
    $nature.className = 'font-10 detail-heading';
    $natureName.className = 'font-10 margin-left-10';
    $rightCard.className = 'col-half right-card relative';

    $deleteIcon.addEventListener('click', openDeleteModal);

    $ability.textContent = 'Ability:';
    if (obj.members[pokemonIndex].ability === '') {
      $abilityName.textContent = obj.members[pokemonIndex].ability;
    } else {
      $abilityName.textContent = obj.members[pokemonIndex].ability[0].toUpperCase() + obj.members[pokemonIndex].ability.slice(1);
    }
    $item.textContent = 'Item:';
    $itemName.textContent = obj.members[pokemonIndex].item;
    $nature.textContent = 'Nature:';
    $natureName.textContent = obj.members[pokemonIndex].nature;

    $typeIcon1.setAttribute('src', obj.members[pokemonIndex].type[0]);
    $typeIcon2.setAttribute('src', obj.members[pokemonIndex].type[1]);
    $deleteIcon.setAttribute('data-pokemon', obj.members[pokemonIndex].name);
    $deleteIcon.setAttribute('data-team', obj.name);

    $deleteIconDiv.append($deleteIcon);
    $rightCard.appendChild($deleteIconDiv);
    $iconDiv.append($typeIcon1, $typeIcon2);
    $abilityDiv.append($ability, $abilityName);
    $itemDiv.append($item, $itemName);
    $natureDiv.append($nature, $natureName);
    $leftCard.append($iconDiv, $abilityDiv, $itemDiv, $natureDiv);
    $wholeCard.append($leftCard, $rightCard);
    $cardHolder.appendChild($wholeCard);
  }
  return $col;
}

function Pokemon(name, ability, item, nature, moveArray) {
  this.name = name;
  this.ability = ability;
  this.item = item;
  this.move = moveArray;
  this.nature = nature;
  this.sprites = {};
  this.sprites.front_default = $customizePImage.getAttribute('src');
  this.type = [$typeDisplay[0].getAttribute('src'), $typeDisplay[1].getAttribute('src')];
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

Team.prototype.removeMember = function (memberName) {
  for (let i = 0; i < this.members.length; i++) {
    if (this.members[i].name === memberName) {
      this.members.splice(i, 1);
    }
  }
};
