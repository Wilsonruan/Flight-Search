$(document).ready(() => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
  
    function success(pos) {
      var crd = pos.coords;
      var longAtt = crd.longitude.toFixed(3).replace(/\.(\d\d)\d?$/, '.$1')
      var latAtt = crd.latitude.toFixed(3).replace(/\.(\d\d)\d?$/, '.$1')
      var yourLocation = "https://api.openweathermap.org/data/2.5/weather?lat=" + latAtt + "&lon=" + longAtt + "&appid=02c767f928e7e5ad4f0e01b6982bd3e6"
      console.log(yourLocation)
      $.ajax({
        url: yourLocation,
        method: "GET"
      }).then(function (response) {
          $('#country-name').val(response['sys']['country'])
          console.log(response['sys']['country'])
          var countryName = response['sys']['country'];
          var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://countries-cities.p.rapidapi.com/location/country/" + countryName,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "countries-cities.p.rapidapi.com",
                "x-rapidapi-key": "b54c55a6edmsh6c049f7b3fa366fp145a1ajsna8fa9fa1eefb"
            }
        }
        
        $.ajax(settings).done(function (response) {
          $('#currency-name').val(response.currency.code);
            console.log(response.currency.code);
        });
      })
  
    }
    function error() {
      $('#currency-name').val('USD');
      $('#country-name').val('US')
    }
  
    navigator.geolocation.getCurrentPosition(success, error, options);
  });