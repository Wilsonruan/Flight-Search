$(document).ready(() => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    $('#currency-name').val('CAD'); //In case, our countries-cities API fail. 
    $('#currencyList').append('<option value="CAD">CAD-Canadian Dollar</option>')
    currencyListApp ()
    const crd = pos.coords;
    const longAtt = crd.longitude.toFixed(3).replace(/\.(\d\d)\d?$/, '.$1');
    const latAtt = crd.latitude.toFixed(3).replace(/\.(\d\d)\d?$/, '.$1');
    const yourLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${latAtt}&lon=${longAtt}&appid=02c767f928e7e5ad4f0e01b6982bd3e6`;
    console.log(yourLocation);
    $.ajax({
      url: yourLocation,
      method: 'GET',
    }).then((response) => {
      $('#country-name').val(response.sys.country);
      console.log(response.sys.country);
      const countryName = response.sys.country;
      const settings = {
        async: true,
        crossDomain: true,
        url: `https://countries-cities.p.rapidapi.com/location/country/${countryName}`,
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'countries-cities.p.rapidapi.com',
          'x-rapidapi-key': 'b54c55a6edmsh6c049f7b3fa366fp145a1ajsna8fa9fa1eefb',
        },
      };

      $.ajax(settings).done((response) => {
        $('#currency-name').val(response.currency.code);
        console.log(response.currency.code);
        currencyListApp (response.currency.code)
      });
    });
  }
  function error() {
    $('#currency-name').val('USD');
    $('#currencyList').append('<option value="USD">USD-US Dollar</option>')
    currencyListApp ()
    $('#country-name').val('US');
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
});

function currencyListApp (codeValue) {
  $( function() {
    var availableTags = [
        "AED-United Arab Emirates Dirham",
        "AFN-Afghan Afghani",
        "ALL-Albanian Lek",
        "AMD-Armenian Dram",
        "ANG-Netherlands Antillean Guilder",
        "AOA-Angolan Kwanza",
        "ARS-Argentine Peso",
        "AUD-Australian Dollar",
        "AWG-Aruban Florin",
        "AZN-Azerbaijani Manat",
        "BAM-Bosnia-Herzegovina Convertible Mark",
        "BBD-Barbadian Dollar",
        "BDT-Bangladeshi Taka",
        "BGN-Bulgarian Lev",
        "BHD-Bahraini Dinar",
        "BIF-Burundian Franc",
        "BND-Brunei Dollar",
        "BOB-Bolivian Boliviano",
        "BRL-Brazilian Real",
        "BSD-Bahamian Dollar",
        "BWP-Botswanan Pula",
        "BYN-Belarusian Ruble",
        "BZD-Belize Dollar",
        "CAD-Canadian Dollar",
        "CDF-Congolese Franc",
        "CHF-Swiss Franc",
        "CLP-Chilean Peso",
        "CNY-Chinese Yuan",
        "COP-Colombian Peso",
        "CRC-Costa Rican Colon",
        "CUP-Cuban Peso",
        "CVE-Cape Verdean Escudo",
        "CZK-Czech Koruna",
        "DJF-Djiboutian Franc",
        "DKK-Danish Krone",
        "DOP-Dominican Peso",
        "DZD-Algerian Dinar",
        "EGP-Egyptian Pound",
        "ERN-Eritrean Nakfa",
        "ETB-Ethiopian Birr",
        "EUR-Euro",
        "FJD-Fijian Dollar",
        "GBP-Pound Sterling",
        "GEL-Georgian Lari",
        "GHS-Ghanaian Cedi",
        "GIP-Gibraltar Pound",
        "GMD-Gambian Dalasi",
        "GNF-Guinean Franc",
        "GTQ-Guatemalan Quetzal",
        "GYD-Guyanaese Dollar",
        "HKD-Hong Kong Dollar",
        "HNL-Honduran Lempira",
        "HRK-Croatian Kuna",
        "HTG-Haitian Gourde",
        "HUF-Hungarian Forint",
        "IDR-Indonesian Rupiah",
        "ILS-Israeli Shekel",
        "INR-Indian Rupee",
        "IQD-Iraqi Dinar",
        "IRR-Iranian Rial",
        "ISK-Icelandic Krona",
        "JMD-Jamaican Dollar",
        "JOD-Jordanian Dinar",
        "JPY-Japanese Yen",
        "KES-Kenyan Shilling",
        "KGS-Kyrgystani Som",
        "KHR-Cambodian Riel",
        "KMF-Comorian Franc",
        "KRW-South Korean Won",
        "KWD-Kuwaiti Dinar",
        "KZT-Kazakhstani Tenge",
        "LAK-Laotian Kip",
        "LBP-Lebanese Pound",
        "LKR-Sri Lankan Rupee",
        "LRD-Liberian Dollar",
        "LSL-Lesotho Loti",
        "LYD-Libyan Dinar",
        "MAD-Moroccan Dirham",
        "MDL-Moldovan Leu",
        "MGA-Malagasy Ariary",
        "MKD-Macedonian Denar",
        "MMK-Myanma Kyat",
        "MNT-Mongolian Tugrik",
        "MOP-Macanese Pataca",
        "MUR-Mauritian Rupee",
        "MVR-Maldivian Rufiyaa",
        "MWK-Malawian Kwacha",
        "MXN-Mexican Peso",
        "MYR-Malaysian Ringgit",
        "MZN-Mozambican Metical",
        "NAD-Namibian Dollar",
        "NGN-Nigerian Naira",
        "NIO-Nicaraguan Cordoba",
        "NOK-Norwegian Krone",
        "NPR-Nepalese Rupee",
        "NZD-New Zealand Dollar",
        "OMR-Omani Rial",
        "PAB-Panamanian Balboa",
        "PEN-Peruvian Nuevo Sol",
        "PGK-Papua New Guinean Kina",
        "PHP-Philippine Peso",
        "PKR-Pakistani Rupee",
        "PLN-Polish Zloty",
        "PYG-Paraguayan Guarani",
        "QAR-Qatari Rial",
        "RON-Romanian Leu",
        "RSD-Serbian Dinar",
        "RUB-Russian Ruble",
        "RWF-Rwandan Franc",
        "SAR-Saudi Riyal",
        "SBD-Solomon Islands Dollar",
        "SCR-Seychellois Rupee",
        "SDG-Sudanese Pound",
        "SEK-Swedish Krona",
        "SGD-Singapore Dollar",
        "SLL-Sierra Leonean Leone",
        "SOS-Somali Shilling",
        "SRD-Surinamese Dollar",
        "SSP-South Sudanese Pound",
        "SVC-Salvadoran Colon",
        "SYP-Syrian Pound",
        "SZL-Swazi Lilangeni",
        "THB-Thai Baht",
        "TJS-Tajikistani Somoni",
        "TMT-Turkmenistani Manat",
        "TND-Tunisian Dinar",
        "TOP-Tongan Pa?anga",
        "TRY-Turkish Lira",
        "TTD-Trinidad and Tobago Dollar",
        "TWD-New Taiwan Dollar",
        "TZS-Tanzanian Shilling",
        "UAH-Ukrainian Hryvnia",
        "UGX-Ugandan Shilling",
        "USD-US Dollar",
        "UYU-Uruguayan Peso",
        "UZS-Uzbekistan Som",
        "VES-Venezuelan Bolivar",
        "VND-Vietnamese Dong",
        "VUV-Vanuatu Vatu",
        "WST-Samoan Tala",
        "XAF-CFA Franc BEAC",
        "XCD-East Caribbean Dollar",
        "XOF-CFA Franc BCEAO",
        "XPF-CFP Franc",
        "YER-Yemeni Rial",
        "ZAR-South African Rand",
        "ZMW-Zambian Kwacha"
    ];
    for (var i = 0; i < availableTags.length; i++) {
      var codeCountry = availableTags[i].substring(0,3);
      if (codeCountry === codeValue) {
        $('#currencyList').append('<option value="' + codeCountry + '">' + availableTags[i] + '</option>')
      }
    }

    for (var i = 0; i < availableTags.length; i++) {
      var codeCountry = availableTags[i].substring(0,3);
      $('#currencyList').append('<option value="' + codeCountry + '">' + availableTags[i] + '</option>')
    }
  })
}
