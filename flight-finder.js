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

// One-way function
function flightFinderOneWay(queryString) {
  const originPlace = queryString['from-location-code'];
  const destinationPlace = queryString['to-location-code'];
  const outboundDate = queryString['depart-from'];
  const countryName = queryString['country-name'];
  const currencyName = queryString['currency-name'];
  $('#depart-date').html(outboundDate);
  $('#arrival-date').html('(One-Way)');
  $('#origin-code').html(originPlace);
  $('#destination-code').html(destinationPlace);

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${countryName}/${currencyName}/en-US/${originPlace}/${destinationPlace}/${outboundDate}`;
  console.log(queryURL);
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
    for (let i = 0; i < response.Quotes.length; i += 1) {
      // adding airlines name
      const card = $('<div>');
      card.addClass('card m-5');
      card.appendTo('.flights-display');
      const airlineCode = response.Quotes[i].OutboundLeg.CarrierIds[0];
      const cardBody = $('<div>');
      cardBody.appendTo(card);
      // adding flight price
      const bestPrice = response.Quotes[i].MinPrice;
      const currencySymbol = response.Currencies[0].Symbol;
      cardBody.append(`<p>Flight Price : ${currencySymbol}${bestPrice} </p>`);
      const directFlight = response.Quotes[i].Direct;
      cardBody.append(`<p>Direct Flight: ${directFlight} </p>`);
      // adding carrier name & carrier code
      for (let i = 0; i < response.Carriers.length; i++) {
        if (airlineCode === response.Carriers[i].CarrierId) {
          const airlineName = response.Carriers[i].Name;
          cardBody.append(`<p> Airlines:${airlineName}</p>`);
          // const airlineLogo = $('<img>');
          // airlineLogo.attr('src', 'https://daisycon.io/images/airline/?width=100&height=150&color=ffffff&iata=ac');
          // cardBody.append(airlineLogo);
          cardBody.append(`<p>Airline ID: ${airlineCode}</p>`);
        }
      }
      // adding source and destination names
      const source = response.Places[1].Name;
      const sourceCode = response.Places[1].IataCode;
      const destination = response.Places[0].Name;
      const destinationCode = response.Places[0].IataCode;
      cardBody.append(`<p>${sourceCode} &#x27F6; ${destinationCode} </p>`);
      cardBody.append(`<p> ${source}  &#x27F6; ${destination} </p>`);
      calcDistance(sourceCode, destinationCode, cardBody);
    }
  });
}

// Round-trip function
function flightFinderRoundTrip(queryString) {
  const originPlace = queryString['from-location-code'];
  const destinationPlace = queryString['to-location-code'];
  const outboundDate = queryString['depart-from'];
  const inboundDate = queryString['return-to'];
  const countryName = queryString['country-name'];
  const currencyName = queryString['currency-name'];
  $('#depart-date').html(outboundDate);
  $('#arrival-date').html(inboundDate);
  $('#origin-code').html(originPlace);
  $('#destination-code').html(destinationPlace);
  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${countryName}/${currencyName}/en-US/${originPlace}/${destinationPlace}/${outboundDate}/${inboundDate}`;
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

    for (let i = 0; i < response.Quotes.length; i += 1) {
      const card = $('<div>');
      card.addClass('card m-5');
      card.appendTo('.flights-display');
      const cardBody = $('<div>');
      cardBody.appendTo(card);

      // adding flight price
      const bestPrice = response.Quotes[i].MinPrice;
      const currencySymbol = response.Currencies[0].Symbol;
      cardBody.append(`<p>Flight Price : ${currencySymbol}${bestPrice} </p>`);
      const directFlight = response.Quotes[i].Direct;
      cardBody.append(`<p>Direct Flight: ${directFlight} </p>`);

      // Outbound details
      // adding carrier name & carrier code for outbound
      const outboundCode = response.Quotes[i].OutboundLeg.CarrierIds[0];
      for (let i = 0; i < response.Carriers.length; i++) {
        if (outboundCode === response.Carriers[i].CarrierId) {
          const airlineName = response.Carriers[i].Name;
          cardBody.append(`<p>Airlines: ${airlineName}</p>`);
          cardBody.append(`<p>Airline Code: ${outboundCode}</p>`);
        }
      }
      // Source and destination details for Outbound
      const originId = response.Quotes[i].OutboundLeg.OriginId;
      const destinationId = response.Quotes[i].OutboundLeg.DestinationId;
      const departureDateold = response.Quotes[i].OutboundLeg.DepartureDate;
      const departureDate = moment(departureDateold).format('L');
      const originName = response.Places[1].Name;
      const originCode = response.Places[1].IataCode;
      cardBody.append(`<p> Origin: ${originName}- ${originCode} (ID: ${originId})</p>`);
      const destinationName = response.Places[0].Name;
      const destinationCode = response.Places[0].IataCode;
      cardBody.append(`<p>Destination: ${destinationName} - ${destinationCode} ( ID: ${destinationId})</p>`);
      cardBody.append(`<p>${originCode} &#x27F6; ${destinationCode}</p>`);
      cardBody.append(`<p>Departure Date: ${departureDate}</p>`);

      // inbound details
      // Source and destination details for inbound
      const originIdReturn = response.Quotes[i].InboundLeg.OriginId;
      const destinationIdReturn = response.Quotes[i].InboundLeg.DestinationId;
      const departureDateoldReturn = response.Quotes[i].InboundLeg.DepartureDate;
      const departureDateReturn = moment(departureDateoldReturn).format('L');
      cardBody.append('<hr>');
      // adding carrier name & carrier code for inbound
      const inboundCode = response.Quotes[i].InboundLeg.CarrierIds[0];
      for (let i = 0; i < response.Carriers.length; i++) {
        if (inboundCode === response.Carriers[i].CarrierId) {
          const airlineName = response.Carriers[i].Name;
          cardBody.append(`<p> Airlines: ${airlineName}</p>`);
          cardBody.append(`<p> Airline Code: ${inboundCode}</p>`);
        }
      }
      const originNameReturn = response.Places[0].Name;
      const originCodeReturn = response.Places[0].IataCode;
      cardBody.append(`<p>Origin: ${originNameReturn} - ${originCodeReturn} ( ID: ${originIdReturn})</p>`);
      const destinationNameReturn = response.Places[1].Name;
      const destinationCodeReturn = response.Places[1].IataCode;
      cardBody.append(`<p>Destination: ${destinationNameReturn} - ${destinationCodeReturn} ( ID: ${destinationIdReturn})</p>`);
      cardBody.append(`<p>${originCodeReturn} &#x27F6; ${destinationCodeReturn}</p>`);
      cardBody.append(`<p>Arrival Date: ${departureDateReturn}</p>`);
      calcDistance(originPlace, destinationPlace, cardBody);
    }
  });
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
      const timeTakenInMin = (distance / 850).toFixed(1);
      cardBody.append(`<p>Distance: ${Math.round(distance)} Km </p>`);
      cardBody.append(`<p>Travel time: ${timeTakenInMin} hrs </p>`);
    });
  });
}

$(document).ready(() => {
  const queryString = getUrlVars();
  const inboundDate = queryString['return-to'];
  if (inboundDate) {
    flightFinderRoundTrip(queryString);
  } else {
    flightFinderOneWay(queryString);
  }
});

