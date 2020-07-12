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
function calcDistance(sourceCode, destinationCode, cardBody) {
  const settings1 = {
    async: true,
    crossDomain: true,
    url: `https://airport-info.p.rapidapi.com/airport?iata=${sourceCode}`,
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'airport-info.p.rapidapi.com',
      'x-rapidapi-key': 'b54c55a6edmsh6c049f7b3fa366fp145a1ajsna8fa9fa1eefb',
    },
  };
  $.ajax(settings1).done((response1) => {
    const settings2 = {
      async: true,
      crossDomain: true,
      url: `https://airport-info.p.rapidapi.com/airport?iata=${destinationCode}`,
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'airport-info.p.rapidapi.com',
        'x-rapidapi-key': 'b54c55a6edmsh6c049f7b3fa366fp145a1ajsna8fa9fa1eefb',
      },
    };
    $.ajax(settings2).done((response2) => {
      const distance = getDistanceFromLatLonInKm(response1.latitude, response1.longitude, response2.latitude, response2.longitude);
      cardBody.append(`<p>Distance: ${Math.round(distance)} Km </p>`);
      const timeTakenInMin = ((distance / 850) + 0.7).toFixed(1);
      const timeIncludingmin = minTohhmm(timeTakenInMin);
      cardBody.append(`<p>Travel time: ${timeIncludingmin} hrs </p>`);
    });
  });
}

function minTohhmm(minutes) {
  const sign = minutes < 0 ? '-' : '';
  const min = Math.floor(Math.abs(minutes));
  const sec = Math.floor((Math.abs(minutes) * 60) % 60);
  return `${sign + (min < 10 ? '0' : '') + min}:${sec < 10 ? '0' : ''}${sec}`;
}

function getCarrierName(carrierList, carrierId) {
  let airlineName;
  for (let i = 0; i < carrierList.length; i += 1) {
    if (carrierId === carrierList[i].CarrierId) {
      airlineName = carrierList[i].Name;
    }
  }
  return airlineName;
}

function showNoResultFound() {
  const card = $('<div>');
  card.addClass('card m-5');
  card.appendTo('.flights-display');
  card.append('<p>No results were Found.</p>');
}

function getStripped(airportName) {
  return airportName.split('+').join(' ');
}

// One-way function
function flightFinderOneWay(queryString) {
  const originPlaceCode = queryString['from-location-code'].toUpperCase();
  const originPlace = getStripped(queryString['from-location']);
  const destinationPlaceCode = queryString['to-location-code'].toUpperCase();
  const destinationPlace = getStripped(queryString['to-location']);
  const outboundDate = queryString['depart-from'];
  const countryName = queryString['country-name'];
  const countryCode = queryString.currencyList;
  const travelers = getStripped(queryString.travelers);
  $('#depart-date').html(outboundDate);
  $('#arrival-date').html('(One-Way)');
  $('#origin-code').html(originPlaceCode);
  $('#destination-code').html(destinationPlaceCode);
  $('#travelers-results').html(travelers);

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${countryName}/${countryCode}/en-US/${originPlaceCode}/${destinationPlaceCode}/${outboundDate}`;
  $.ajax({
    url: queryURL,
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      'x-rapidapi-key': 'b54c55a6edmsh6c049f7b3fa366fp145a1ajsna8fa9fa1eefb',
      useQueryString: true,
    },
  }).then((response) => {
    if (response.Quotes.length === 0) {
      showNoResultFound();
    }
    for (let i = 0; i < response.Quotes.length; i += 1) {
      // adding airlines name
      const flightPrice = response.Quotes[i].MinPrice;
      const currencySymbol = response.Currencies[0].Symbol;
      const currencyCode = response.Currencies[0].Code;

      const departureDate = moment(response.Quotes[i].OutboundLeg.DepartureDate).format('L');
      const carrierId = response.Quotes[i].OutboundLeg.CarrierIds[0];
      const carrierName = getCarrierName(response.Carriers, carrierId);

      const directFlight = response.Quotes[i].Direct ? 'Yes' : 'No';

      const card = $('<div>');
      card.addClass('card m-5');
      card.appendTo('#search-results');
      const cardBody = $('<div>');
      cardBody.appendTo(card);

      cardBody.append(`<p>Flight Price : ${currencySymbol} ${flightPrice} ${currencyCode}</p>`);
      cardBody.append(`<p>Departure Date : ${departureDate}</p>`);
      cardBody.append(`<p>Carrier Name : ${carrierName}</p>`);
      cardBody.append(`<p>Carrier Id : ${carrierId}</p>`);
      cardBody.append(`<p>${originPlace} (${originPlaceCode}) &#x27F6; ${destinationPlace} (${destinationPlaceCode})</p>`);
      cardBody.append(`<p>Direct Flight: ${directFlight} </p>`);
      calcDistance(originPlaceCode, destinationPlaceCode, cardBody);
    }
  });
}

// Round-trip function
function flightFinderRoundTrip(queryString) {
  const originPlaceCode = queryString['from-location-code'].toUpperCase();
  const originPlace = getStripped(queryString['from-location']);
  const destinationPlaceCode = queryString['to-location-code'].toUpperCase();
  const destinationPlace = getStripped(queryString['to-location']);
  const outboundDate = queryString['depart-from'];
  const inboundDate = queryString['return-to'];
  const countryName = queryString['country-name'];
  const countryCode = queryString.currencyList;
  const travelers = getStripped(queryString.travelers);
  $('#depart-date').html(outboundDate);
  $('#arrival-date').html(inboundDate);
  $('#origin-code').html(originPlaceCode.toUpperCase());
  $('#destination-code').html(destinationPlaceCode.toUpperCase());
  $('#travelers-results').html(travelers);

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${countryName}/${countryCode}/en-US/${originPlaceCode}/${destinationPlaceCode}/${outboundDate}/${inboundDate}`;
  $.ajax({
    url: queryURL,
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      'x-rapidapi-key': 'b54c55a6edmsh6c049f7b3fa366fp145a1ajsna8fa9fa1eefb',
      useQueryString: true,
    },
  }).then((response) => {

    for (let i = 0; i < response.Quotes.length; i += 1) {
      const flightPrice = response.Quotes[i].MinPrice;
      const currencySymbol = response.Currencies[0].Symbol;
      const currencyCode = response.Currencies[0].Code;

      const departureDate = moment(response.Quotes[i].OutboundLeg.DepartureDate).format('L');
      const outboundCarrierId = response.Quotes[i].OutboundLeg.CarrierIds[0];
      const outboundCarrierName = getCarrierName(response.Carriers, outboundCarrierId);

      const returnDate = moment(response.Quotes[i].InboundLeg.DepartureDate).format('L');
      const inboundCarrierId = response.Quotes[i].InboundLeg.CarrierIds[0];
      const inboundCarrierName = getCarrierName(response.Carriers, inboundCarrierId);

      const directFlight = response.Quotes[i].Direct ? 'Yes' : 'No';

      const card = $('<div>');
      const cardBody = $('<div>');
      card.addClass('card m-5');
      card.appendTo('#search-results');
      cardBody.appendTo(card);

      // outbound
      cardBody.append(`<p>Flight Price : ${currencySymbol} ${flightPrice} ${currencyCode}</p>`);
      cardBody.append(`<p>Departure Date: ${departureDate}</p>`);
      cardBody.append(`<p>Carrier Name: ${outboundCarrierName}</p>`);
      cardBody.append(`<p>Carrier Id: ${outboundCarrierId}</p>`);
      cardBody.append(`<p>${originPlace} (${originPlaceCode}) &#x27F6; ${destinationPlace} (${destinationPlaceCode})</p>`);
      cardBody.append(`<p>Direct Flight: ${directFlight} </p>`);

      cardBody.append('<hr>');

      // inbound
      cardBody.append(`<p>Return Date: ${returnDate}</p>`);
      cardBody.append(`<p>Carrier Name: ${inboundCarrierName}</p>`);
      cardBody.append(`<p>Carrier Id: ${inboundCarrierId}</p>`);
      cardBody.append(`<p> ${destinationPlace} (${destinationPlaceCode})  &#x27F6; ${originPlace} (${originPlaceCode})</p>`);
      cardBody.append(`<p>Direct Flight: ${directFlight} </p>`);
      calcDistance(originPlaceCode, destinationPlaceCode, cardBody);
    }
  });
}

// One-way function
function flightFinderOneWayW(queryString) {
  const originPlace = queryString['from-location-code'];
  const destinationPlace = queryString['to-location-code'];
  const outboundDate = queryString['depart-from'];
  const inboundDate = queryString['return-to'];
  const countryName = queryString['country-name'];
  const countryCode = queryString.currencyList;

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${countryName}/${countryCode}/en-US/${originPlace}/${destinationPlace}/${outboundDate}`;
  $.ajax({
    async: true,
    crossDomain: true,
    url: queryURL,
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      'x-rapidapi-key': '8ee516d0d4msh56ee08c36447777p1f395djsn9a5475b18ac7',
      useQueryString: true,
    },
  }).then((response) => {
    const resultTitle = `Outbound Date: ${outboundDate}`;
    resultsFlight(response, resultTitle, 'only-outbound');
  });
}

function flightFinderReturnTripW(queryString) {
  const originPlace = queryString['to-location-code'];
  const destinationPlace = queryString['from-location-code'];
  const outboundDate = queryString['return-to'];
  const countryName = queryString['country-name'];
  const countryCode = queryString.currencyList;

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${countryName}/${countryCode}/en-US/${originPlace}/${destinationPlace}/${outboundDate}`;
  $.ajax({
    url: queryURL,
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      'x-rapidapi-key': '8ee516d0d4msh56ee08c36447777p1f395djsn9a5475b18ac7',
      useQueryString: true,
    },
  }).then((response) => {
    const resultTitle = `Return Date: ${outboundDate}`;
    resultsFlight(response, resultTitle, 'only-inbound');
  });
}

function resultsFlight(response, resultTitle, resultTypeId) {
  for (let i = 0; i < response.Quotes.length; i++) {
    // adding airlines name
    const flightPrice = response.Quotes[i].MinPrice;
    const currencySymbol = response.Currencies[0].Symbol;
    const currencyCode = response.Currencies[0].Code;

    const source = response.Places[1].Name;
    const sourceCode = response.Places[1].IataCode;
    const destination = response.Places[0].Name;
    const destinationCode = response.Places[0].IataCode;

    const carrierId = response.Quotes[i].OutboundLeg.CarrierIds[0];
    const carrierName = getCarrierName(response.Carriers, carrierId);

    const directFlight = response.Quotes[i].Direct ? 'Yes' : 'No';

    const card = $('<div>');
    card.addClass('card m-5');
    card.appendTo(`#${resultTypeId}`);
    const cardBody = $('<div>');
    cardBody.appendTo(card);

    cardBody.append(`<p>Flight Price : ${currencySymbol}${flightPrice} ${currencyCode}</p>`);
    cardBody.append(`<p>${resultTitle}</p>`);
    cardBody.append(`<p>Carrier Name : ${carrierName}</p>`);
    cardBody.append(`<p>Carrier Id : ${carrierId}</p>`);
    cardBody.append(`<p>Direct Flight : ${directFlight} </p>`);
    cardBody.append(`<p>${source} (${sourceCode}) &#x27F6; ${destination} (${destinationCode})</p>`);
    calcDistance(sourceCode, destinationCode, cardBody);
  }
}


$(document).ready(() => {
  const queryString = getUrlVars();
  const inboundDate = queryString['return-to'];
  if (inboundDate) {
    flightFinderRoundTrip(queryString);
    flightFinderOneWayW(queryString);
    flightFinderReturnTripW(queryString);
  } else {
    flightFinderOneWay(queryString);
  }
});
