function airportInfoAPI(airportInfo, codeName) {
  airportInfo.focusout(() => {
    const airportLocation = airportInfo.val();
    const settings = {
      async: true,
      crossDomain: true,
      url: `https://airport-info.p.rapidapi.com/airport?iata=${airportLocation}`,
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'airport-info.p.rapidapi.com',
        'x-rapidapi-key': 'b54c55a6edmsh6c049f7b3fa366fp145a1ajsna8fa9fa1eefb',
      },
    };
    $.ajax(settings).done((response) => {
      console.log(response);
      airportInfo.val(response.name);
      codeName.val(airportLocation);
    });
  });
}

function lookupAirports() {
  return $.getJSON("https://rawgit.com/tjvantoll/jquery-ui-in-action-demos/master/chapter-11/json/airports.json");
};

$(document).ready(() => {
  var fromAirport = $("#from-location"),
    toAirport = $("#to-location")

  lookupAirports().then(function (data) {
    fromAirport.add(toAirport)
      .autocomplete({
        source: data.airports,
        minLength: 2
      });
  });
  airportInfoAPI(toAirport, $('#to-location-code'));
  airportInfoAPI(fromAirport, $('#from-location-code'));


  $('#button-swap').click(() => {
    const toLocation = toAirport.val();
    const fromLocation = fromAirport.val();
    const toLocationCode = $('#to-location-code').val();
    const fromLocationCode = $('#from-location-code').val();
    toAirport.val(fromLocation);
    fromAirport.val(toLocation);
    $('#to-location-code').val(fromLocationCode)
    $('#from-location-code').val(toLocationCode)
  });

  calcDistance('DEL', 'YYZ');
});




function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

// calculate distance between src, destination using lat,long
function calcDistance(sourceCode, destinationCode) {
  const settings = {
    async: true,
    crossDomain: true,
    url: `https://airport-info.p.rapidapi.com/airport?iata=${sourceCode}`,
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'airport-info.p.rapidapi.com',
      'x-rapidapi-key': 'b54c55a6edmsh6c049f7b3fa366fp145a1ajsna8fa9fa1eefb',
    },
  };
  $.ajax(settings).done((response) => {
    console.log(response);
  });
}