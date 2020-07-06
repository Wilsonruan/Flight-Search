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

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${countryName}/${currercyName}/en-US/${originPlace}/${destinationPlace}/${outboundDate}?inboundpartialdate=${inboundDate}`;
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
