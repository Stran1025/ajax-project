/* exported data */

var data = {
  editing: null,
  view: 'search',
  currentType: [],
  currentPokemon: null,
  team: []
};

window.addEventListener('beforeunload', saveData);

function saveData(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('pokemon-team-data', dataJSON);
}

var previousdataJSON = localStorage.getItem('pokemon-team-data');
if (previousdataJSON !== null) {
  data = JSON.parse(previousdataJSON);
}
