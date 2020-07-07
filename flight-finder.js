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
  const originPlace = queryString['from-location-code'];
  const destinationPlace = queryString['to-location-code'];
  const outboundDate = queryString['depart-from'];
  const inboundDate = queryString['return-to'];
  const countryName = queryString['country-name'];
  const currercyName = queryString['currency-name'];
  $('#depart-date').html(outboundDate);
  $('#arrival-date').html(inboundDate);
  $('#origin-code').html(originPlace);
  $('#destination-code').html(destinationPlace);

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${originPlace}/${destinationPlace}/${outboundDate}?inboundpartialdate=${inboundDate}`;
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
    for (var i = 0; i < response.Carriers.length; i++) {
      var airlines = response['Carriers'][i]['Name'];
      $('#airlines-name').append('<p>' + airlines + '</p>') 
    }
    $('#best-price').append()
    console.log(response.Quotes[0].MinPrice)  //best price
    console.log(response.Quotes[0].OutboundLeg.CarrierIds[0]) //Best Airline

  });
}

$(document).ready(() => {
  flightFinder();
});
