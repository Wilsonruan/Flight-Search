// Date picker calendar
function setMinDateForReturn() {
  const departDate = $('#depart-from').val();
  const pdd = new Date(Date.parse(departDate));
  $('#return-to').datepicker('option', 'minDate', pdd);
}

$(document).ready(() => {
  $('#depart-from').datepicker({
    onSelect: setMinDateForReturn,
    showAnim: 'slideDown',
    minDate: '0D',
    maxDate: '+2Y',
  });

  $('#return-to').datepicker({
    showAnim: 'slideDown',
    minDate: '0D',
    maxDate: '+2Y',
  });

});
