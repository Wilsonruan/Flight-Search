$(document).ready(() => {
  $('#depart-from').datepicker({
    showAnim: 'slideDown',
    minDate: "0D",
    maxDate: "+2Y",

  });

  $('#return-to').datepicker({
    showAnim: 'slideDown',
    minDate: "1D",
    maxDate: "+2Y",

  });

});
