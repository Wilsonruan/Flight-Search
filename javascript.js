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

// Date picker calendar
function setMinDateForReturn() {
  const departDate = $('#depart-from').val();
  const pdd = new Date(Date.parse(departDate));
  $('#return-to').datepicker('option', 'minDate', pdd);
}

$(document).ready(() => {
  $('#depart-from').datepicker({
    onSelect: setMinDateForReturn,
    dateFormat: 'yy-mm-dd',
    showAnim: 'slideDown',
    minDate: '0D',
    maxDate: '+2Y',
  });

  $('#return-to').datepicker({
    showAnim: 'slideDown',
    dateFormat: 'yy-mm-dd',
    minDate: '0D',
    maxDate: '+2Y',
  });
});

// No of travelers drop-down
$(document).ready(() => {
  $(document).mouseup((e) => {
    if ($(e.target).closest('.travelerClass').length === 0) {
      $('.travelerClass').hide();
    }
  });

  $('#travelers').click(() => {
    $('.travelerClass').slideToggle(150, () => ($('.travelerClass').is(':visible') ? 'Collapse' : 'Expand'));
  });

  function updateTravelerCount() {
    const adultCount = parseInt($('#adultCount').html(), 10);
    const childCount = parseInt($('#childCount').html(), 10);
    const travelerCount = adultCount + childCount;
    const travelerHtml = travelerCount === 1 ? `${travelerCount} traveler` : `${travelerCount} travelers`;
    $('#travelers').val(travelerHtml);
  }

  function controlAdultCount(adultCount) {
    if (adultCount >= 8) {
      $('#incrementAdult').attr('disabled', true);
      $('#decrementAdult').attr('disabled', false);
    } else if (adultCount <= 1) {
      $('#incrementAdult').attr('disabled', false);
      $('#decrementAdult').attr('disabled', true);
    } else {
      $('#incrementAdult').attr('disabled', false);
      $('#decrementAdult').attr('disabled', false);
    }
  }

  function controlChildCount(childCount) {
    if (childCount >= 8) {
      $('#incrementChild').attr('disabled', true);
      $('#decrementChild').attr('disabled', false);
    } else if (childCount <= 0) {
      $('#incrementChild').attr('disabled', false);
      $('#decrementChild').attr('disabled', true);
    } else {
      $('#incrementChild').attr('disabled', false);
      $('#decrementChild').attr('disabled', false);
    }
  }

  $('#decrementAdult').on('click', () => {
    let adultCount = parseInt($('#adultCount').html(), 10);
    adultCount -= 1;
    if (adultCount > 0) {
      $('#adultCount').html(adultCount);
      updateTravelerCount();
      controlAdultCount(adultCount);
    }
  });

  $('#incrementAdult').on('click', () => {
    let adultCount = parseInt($('#adultCount').html(), 10);
    if (adultCount < 8) {
      adultCount += 1;
      $('#adultCount').html(adultCount);
      updateTravelerCount();
      controlAdultCount(adultCount);
    }
  });

  $('#decrementChild').on('click', () => {
    let childCount = parseInt($('#childCount').html(), 10);
    childCount -= 1;
    if (childCount >= 0) {
      $('#childCount').html(childCount);
      updateTravelerCount();
      controlChildCount(childCount);
    }
  });

  $('#incrementChild').on('click', () => {
    let childCount = parseInt($('#childCount').html(), 10);
    if (childCount < 8) {
      childCount += 1;
      $('#childCount').html(childCount);
      updateTravelerCount();
      controlChildCount(childCount);
    }
  });
});

function getUrlVars() {
  const queryString = {};
  let key;
  let val;
  const queryParams = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (let i = 0; i < queryParams.length; i += 1) {
    [key, val] = queryParams[i].split('=');
    queryString[key] = val;
  }
  return queryString;
}

// Clicking on search button, call this function
function flightFinder() {
  const queryString = getUrlVars();
  const originPlace = 'SFO-sky' || queryString['from-location'];
  const destinationPlace = 'JFK-sky' || queryString['to-location'];
  const outboundDate = queryString['depart-from'];
  const inboundDate = queryString['return-to'];

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${originPlace}/${destinationPlace}/${outboundDate}?inboundpartialdate=${inboundDate}`;

  $.ajax({
    url: queryURL,
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      'x-rapidapi-key': 'e5c89db57bmshf9a894a75ed23f8p1123e0jsnfffe98b83487',
      useQueryString: true,
    },
  }).then((response) => {
    console.log(response);
    $('#airlines-name').html(response.Carriers[0].Name);
    $('#origin-code').html(response.Places[0].IataCode);
    $('#origin-name').html(response.Places[0].Name);
    $('#destination-code').html(response.Places[1].IataCode);
    $('#destination-name').html(response.Places[1].Name);
  });
}

$(document).ready(() => {
  flightFinder();
});