// VARIABLES
let availableStations = [];
let infoStations = [];
let finalArray = []

const botonAñadir = document.querySelectorAll('#boton')[0];
const tableBody = document.querySelectorAll('#tabla')[0];

//  FUNCTION BICI INFO

function getBiciInfo(numeroId2) {
  var requester = new XMLHttpRequest();
  requester.onreadystatechange = function() {
    if (requester.readyState == 4 && requester.status == 200) {
      var dataBiciInfo = JSON.parse(this.responseText);

      for (var i = 0; i < dataBiciInfo.data.stations.length; i++) {
        infoStations.push(dataBiciInfo.data.stations[i])
      }
      getBiciStatus();
    }
  }
  requester.open("GET", "https://cors-anywhere.herokuapp.com/https://api.bsmsa.eu/ext/api/bsm/gbfs/v2/en/station_information");
  requester.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  requester.send();
}

// FUNCTION BICI STATUS

function getBiciStatus(numeroId2) {
  var requester2 = new XMLHttpRequest();
  requester2.onreadystatechange = function() {
    if (requester2.readyState == 4 && requester2.status == 200) {
      var dataBiciStatus = JSON.parse(this.responseText);

      for (var i = 0; i < dataBiciStatus.data.stations.length; i++) {
        if (dataBiciStatus.data.stations[i].num_bikes_available > 0) {
          availableStations.push(dataBiciStatus.data.stations[i])
        }
      }
      createNewArray(availableStations);
      printNewArray(finalArray);
    }
  }
  requester2.open("GET", "https://cors-anywhere.herokuapp.com/https://api.bsmsa.eu/ext/api/bsm/gbfs/v2/en/station_status");
  requester2.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  requester2.send();
}

// FUNCION CREAR NUEVA ARRAY

function createNewArray(availableStations) {
  for (var i = 0; i < infoStations.length; i++) {
    for (var j = 0; j < availableStations.length; j++) {
      if (infoStations[i].station_id === availableStations[j].station_id) {

        let newObj = {
          street: infoStations[i].name,
          e_bikes: availableStations[j].num_bikes_available_types.ebike,
          Mechanical: availableStations[j].num_bikes_available_types.mechanical,
          total: availableStations[j].num_bikes_available,
          update: availableStations[j].last_reported,
          lat: infoStations[i].lat,
          lon: infoStations[i].lon
        };

        finalArray.push(newObj)
      }
    }
  }
}

// FUNCION PRINT

function printNewArray(availableStations) {
  console.log(infoStations);
  console.log(availableStations);
  console.log(finalArray);
  tableBody.innerHTML += `
    <tr>
      <th scope="col">Street</th>
      <th scope="col">e-Bikes</th>
      <th scope="col">Mechanical</th>
      <th scope="col">TOTAL</th>
      <th scope="col">Last Update</th>
      <th scope="col">Lat</th>
      <th scope="col">Lon</th>
    </tr></br>`

  for (var i = 0; i < finalArray.length; i++) {
    tableBody.innerHTML += `
  <tr>
      <th scope="row">${finalArray[i].street}</th>
      <td>${finalArray[i].e_bikes}</td>
      <td>${finalArray[i].Mechanical}</td>
      <td>${finalArray[i].total}</td>
      <td>${finalArray[i].update}</td>
      <td>${finalArray[i].lat}</td>
      <td>${finalArray[i].lon}</td>
    </tr>`
  }
}

// BINDS Y EVENTOS

botonAñadir.addEventListener('click', function() {
  let numeroId = document.querySelectorAll('#input')[0].value;
  getBiciInfo();
})