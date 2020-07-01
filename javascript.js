$(document).ready(function () {
    airportInfoAPI($('#to-location'))
    airportInfoAPI($('#from-location'))

    $('#button-swap').click(function () {
        var toLocation = $('#to-location').val();
        var fromLocation = $('#from-location').val();
        $('#to-location').val(fromLocation);
        $('#from-location').val(toLocation);
    })
})

function airportInfoAPI(airportInfo) {

    airportInfo.focusout(function () {
        var airportLocation = airportInfo.val();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://airport-info.p.rapidapi.com/airport?iata=" + airportLocation,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "airport-info.p.rapidapi.com",
                "x-rapidapi-key": "b54c55a6edmsh6c049f7b3fa366fp145a1ajsna8fa9fa1eefb"
            }
        }
        $.ajax(settings).done(function (response) {
            airportInfo.val(response['name'])
        });
    });
}

function lookupFlights() {
    var toValue = "SFO"
    var fromValue = "JFK"
    var departDateValue = "2019-09-01"
    var returnDateValue = "2019-12-01"
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + toValue + "-sky/" + fromValue + "-sky/" + departDateValue + "?inboundpartialdate=" + returnDateValue,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "b54c55a6edmsh6c049f7b3fa366fp145a1ajsna8fa9fa1eefb"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}