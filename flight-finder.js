// Clicking on search button, call this function
function flightFinder() {
  const originPlace = $('#from-location').val();
  const destinationPlace = $('#to-location').val();
  const outboundDate = $('#depart-from').val();
  const inboundDate = $('#return-to').val();

  const queryURL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/CA/CAD/en-US/${originPlace}/${destinationPlace}/${outboundDate}/${inboundDate}`;

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
  });
}
