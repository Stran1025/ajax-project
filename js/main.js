var $searchBar = document.querySelector('#search-bar');
var $searchFilter = document.querySelector('#search-filters');
var $pokemonDisplay = document.querySelector('#pokemon-display');

$searchBar.addEventListener('click', handleClick);

function handleClick(event) {
  $searchFilter.classList.toggle('hidden');
}

function createDiv(pokemonName) {

  //  <div class="col-third display-top-space">
  //     <div class="pokemon-head center-width flex">
  //       <img src="images/Poké_Ball_icon.svg.png" class="width-fourth">
  //       <h3 class="font-10">Bulbasaur</h3>
  //     </div>
  //     <div class="pokemon-body center-width">
  //       <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png">
  //     </div>
  //   </div >

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
  $image.setAttribute('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png');
  $h3.className = 'font-10';
  $h3.textContent = pokemonName;

  $col.appendChild($head);
  $col.appendChild($body);
  $head.appendChild($icon);
  $head.appendChild($h3);
  $body.appendChild($image);

  return $col;
}

$pokemonDisplay.appendChild(createDiv('test'));
