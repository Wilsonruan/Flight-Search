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
      'x-rapidapi-key': 'e5c89db57bmshf9a894a75ed23f8p1123e0jsnfffe98b83487',
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
        'x-rapidapi-key': 'e5c89db57bmshf9a894a75ed23f8p1123e0jsnfffe98b83487',
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
    card.appendTo('#search-results');
    card.append('<p>No results were Found.</p>');
}

function getStripped(airportName) {
  airportName = airportName.split('%').join(' ');
  return airportName.split('+').join(' ');
}

// Round-trip function
function flightFinderRoundTrip(originPlaceCode, originPlace, destinationPlaceCode, destinationPlace, outboundDate, inboundDate, countryName, countryCode, idFinder) {

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/${idFinder}/v1.0/${countryName}/${countryCode}/en-US/${originPlaceCode}/${destinationPlaceCode}/${outboundDate}/${inboundDate}`;
  console.log(queryURL)
  $.ajax({
    url: queryURL,
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      'x-rapidapi-key': 'e5c89db57bmshf9a894a75ed23f8p1123e0jsnfffe98b83487',
      useQueryString: true,
    },
  }).then((response) => {
    console.log(response)
    if (response.Quotes.length === 0) {
      showNoResultFound();
    }
    for (let i = 0 ; i < response.Quotes.length; i++)  {
      const flightPrice = response.Quotes[i].MinPrice;
      const currencySymbol = response.Currencies[0].Symbol;
      const currencyCode = response.Currencies[0].Code;

      const departureDate = moment(response.Quotes[i].OutboundLeg.DepartureDate).format('dddd, MMMM Do YYYY');
      const outboundCarrierId = response.Quotes[i].OutboundLeg.CarrierIds[0];
      const outboundCarrierName = getCarrierName(response.Carriers, outboundCarrierId);

      const returnDate = moment(response.Quotes[i].InboundLeg.DepartureDate).format('dddd, MMMM Do YYYY');
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
function flightFinderOneWay(originPlaceCode, originPlace, destinationPlaceCode, destinationPlace, outboundDate, inboundDate, countryName, countryCode, idFinder) {

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/${idFinder}/v1.0/${countryName}/${countryCode}/en-US/${originPlaceCode}/${destinationPlaceCode}/${outboundDate}`;
  console.log(queryURL)
  $.ajax({
    async: true,
    crossDomain: true,
    url: queryURL,
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      'x-rapidapi-key': 'e5c89db57bmshf9a894a75ed23f8p1123e0jsnfffe98b83487',
      useQueryString: true,
    },
  }).then((response) => {
    console.log(response)
    if (response.Quotes.length === 0) {
      showNoResultFound();
    }
    for (let i = 0 ; i < response.Quotes.length; i++)  {
      // adding airlines name
      const flightPrice = response.Quotes[i].MinPrice;
      const currencySymbol = response.Currencies[0].Symbol;
      const currencyCode = response.Currencies[0].Code;

      const departureDate = moment(response.Quotes[i].OutboundLeg.DepartureDate).format('dddd, MMMM Do YYYY');
      const carrierId = response.Quotes[i].OutboundLeg.CarrierIds[0];
      const carrierName = getCarrierName(response.Carriers, carrierId);
      const directFlight = response.Quotes[i].Direct ? 'Yes' : 'No';
  
      const card = $('<div>');
      card.addClass('card m-5');
      card.appendTo(`#only-outbound`);
      const cardBody = $('<div>');
      cardBody.appendTo(card);
  
      cardBody.append(`<p>Flight Price : ${currencySymbol}${flightPrice} ${currencyCode}</p>`);
      cardBody.append(`<p>${inboundDate} ${departureDate}</p>`);
      cardBody.append(`<p>Carrier Name : ${carrierName}</p>`);
      cardBody.append(`<p>Carrier Id : ${carrierId}</p>`);
      cardBody.append(`<p>Direct Flight : ${directFlight} </p>`);
      cardBody.append(`<p>${originPlace} (${originPlaceCode}) &#x27F6; ${destinationPlace} (${destinationPlaceCode})</p>`);
      calcDistance(originPlaceCode, destinationPlaceCode, cardBody);
    }
  });
}

$(document).ready(() => {
  const queryString = getUrlVars();
  const originPlaceCode = queryString['from-location-code'].toUpperCase();
  const originPlace = getStripped(queryString['from-location']);
  const destinationPlaceCode = queryString['to-location-code'].toUpperCase();
  const destinationPlace = getStripped(queryString['to-location']);
  const outboundDate = queryString['depart-from'];
  const inboundDate = queryString['return-to'];
  const countryName = queryString['country-name'];
  const countryCode = queryString.currencyList;
  const travelers = getStripped(queryString.travelers);
  const flexibleTrue = queryString['flexible-code']

  $('#depart-date').html(outboundDate);
  $('#arrival-date').html(inboundDate);
  $('#origin-code').html(originPlaceCode);
  $('#destination-code').html(destinationPlaceCode);
  $('#travelers-results').html(travelers);
  console.log(flexibleTrue)
  let resultTitle = `Departure Date: `;
  if (inboundDate) {
    flightFinderRoundTrip(originPlaceCode, originPlace, destinationPlaceCode, destinationPlace, outboundDate, inboundDate, countryName, countryCode, flexibleTrue);
  } else {
    $('#arrival-date').html('(One-Way)');
    flightFinderOneWay(originPlaceCode, originPlace, destinationPlaceCode, destinationPlace, outboundDate, resultTitle, countryName, countryCode, flexibleTrue);
  }
});
