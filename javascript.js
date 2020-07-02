$(document).ready(() => {
  airportInfoAPI($('#to-location'));
  airportInfoAPI($('#from-location'));

  $('#button-swap').click(() => {
    const toLocation = $('#to-location').val();
    const fromLocation = $('#from-location').val();
    $('#to-location').val(fromLocation);
    $('#from-location').val(toLocation);
  });
});

function airportInfoAPI(airportInfo) {
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
      airportInfo.val(response.name);
    });
  });
}
