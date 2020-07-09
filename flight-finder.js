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
function flightFinderOneWay(queryString) {
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
    const resultTitle = `Outbound Date: ${outboundDate}`;
    resultsFlight (response, resultTitle);
  });
}

function flightFinderRoundTrip(queryString) {
  const originPlace = queryString['to-location-code'];
  const destinationPlace = queryString['from-location-code'];
  const outboundDate = queryString['return-to'];
  const countryName = queryString['country-name'];
  const currencyName = queryString['currency-name'];

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${countryName}/${currencyName}/en-US/${originPlace}/${destinationPlace}/${outboundDate}`;
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
    console.log(response);
    const resultTitle = `Return Date: ${outboundDate}`;
    resultsFlight (response, resultTitle);
  });
}

function resultsFlight (response, resultTitle) {
  for (let i = 0; i < response.Quotes.length; i++) {
    // adding airlines name
    const card = $('<div>');
    card.addClass('card m-5');
    card.appendTo('.flights-display');
    const airlineCode = response.Quotes[i].OutboundLeg.CarrierIds[0];
    const cardBody = $('<div>');
    cardBody.append(`<p>${resultTitle}</p>`);
    cardBody.append(`<p>Carrier Id : ${airlineCode}</p>`);
    cardBody.appendTo(card);
    for (let i = 0; i < response.Carriers.length; i++) {
      if (airlineCode === response.Carriers[i].CarrierId) {
        const airlineName = response.Carriers[i].Name;
        cardBody.append(`<p>Carrier Name : ${airlineName}</p>`);
      }
    }

    // adding flight price
    const bestPrice = response.Quotes[i].MinPrice;
    const currencySymbol = response.Currencies[0].Symbol;
    cardBody.append(`<p>Flight Price : ${currencySymbol}${bestPrice} </p>`);
  }
}

$(document).ready(() => {
  const queryString = getUrlVars();
  const inboundDate = queryString['return-to'];
  if (inboundDate) {
    flightFinderOneWay(queryString);
    flightFinderRoundTrip(queryString);
  } else {
    flightFinderOneWay(queryString);
  }
});
