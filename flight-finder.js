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
      // adding carrier name & carrier code
      for (let i = 0; i < response.Carriers.length; i++) {
        if (airlineCode === response.Carriers[i].CarrierId) {
          const airlineName = response.Carriers[i].Name;
          cardBody.append(`<p> ${airlineName}</p>`);
          // cardBody.append(`<p>Airline ID: ${airlineCode}</p>`);
        }
      }
      // adding source and destination names
      const source = response.Places[1].Name;
      const sourceCode = response.Places[1].IataCode;
      const destination = response.Places[0].Name;
      const destinationCode = response.Places[0].IataCode;
      cardBody.append(`<p>${sourceCode} &#x27F6; ${destinationCode} </p>`);
      // cardBody.append(`<p> ${source}  &#x27F6; ${destination} </p>`);


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
      const card = $('<div>');
      card.addClass('card m-5');
      card.appendTo('.flights-display');
      const cardBody = $('<div>');
      cardBody.appendTo(card);

      // adding flight price
      const bestPrice = response.Quotes[i].MinPrice;
      const currencySymbol = response.Currencies[0].Symbol;
      cardBody.append(`<p>Flight Price : ${currencySymbol}${bestPrice} </p>`);

      // Outbound details
      // adding carrier name & carrier code for outbound
      const outboundCode = response.Quotes[i].OutboundLeg.CarrierIds[0];
      for (let i = 0; i < response.Carriers.length; i++) {
        if (outboundCode === response.Carriers[i].CarrierId) {
          const airlineName = response.Carriers[i].Name;
          cardBody.append(`<p>${airlineName}</p>`);
          // cardBody.append(`<p>Airline Code: ${outboundCode}</p>`);
        }
      }
      // Source and destination details for Outbound
      const originId = response.Quotes[i].OutboundLeg.OriginId;
      const destinationId = response.Quotes[i].OutboundLeg.DestinationId;
      const departureDateold = response.Quotes[i].OutboundLeg.DepartureDate;
      const departureDate = moment(departureDateold).format('L');
      const originName = response.Places[1].Name;
      const originCode = response.Places[1].IataCode;
      // cardBody.append(`<p>$ ${originName}</p>`);
      // cardBody.append(`<p>$ ${originId}</p>`);
      const destinationName = response.Places[0].Name;
      const destinationCode = response.Places[0].IataCode;
      cardBody.append(`<p>${originCode} &#x27F6; ${destinationCode}</p>`);
      // cardBody.append(`<p>Destination: ${destinationName} - ${destinationCode} ( ID: ${destinationId})</p>`);
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
          cardBody.append(`<p> ${airlineName}</p>`);
          // cardBody.append(`<p> Airline Code: ${inboundCode}</p>`);
        }
      }
      const originNameReturn = response.Places[0].Name;
      const originCodeReturn = response.Places[0].IataCode;
      // cardBody.append(`<p>Origin: ${originNameReturn} - ${originCodeReturn} ( ID: ${originIdReturn})</p>`);
      const destinationNameReturn = response.Places[1].Name;
      const destinationCodeReturn = response.Places[1].IataCode;
      cardBody.append(`<p>${originCodeReturn} &#x27F6; ${destinationCodeReturn}</p>`);
      // cardBody.append(`<p>Destination: ${destinationNameReturn} - ${destinationCodeReturn} ( ID: ${destinationIdReturn})</p>`);
      cardBody.append(`<p>Arrival Date: ${departureDateReturn}</p>`);
    }
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
