// Date picker calendar
function setMinDateForReturn() {
  const departDate = $('#depart-from').val();
  const pdd = new Date(Date.parse(`${departDate} 23:59:59`));
  $('#return-to').datepicker('option', 'minDate', pdd);
}

$(document).ready(() => {
  $('#depart-from').datepicker({
    onSelect: setMinDateForReturn,
    dateFormat: 'yy-mm-dd',
    showAnim: 'slideDown',
    minDate: '0D',
    maxDate: '+2Y',
  });

  $('#return-to').datepicker({
    showAnim: 'slideDown',
    dateFormat: 'yy-mm-dd',
    minDate: '0D',
    maxDate: '+2Y',
  });

  $('#btn-return-to').click(() => {
    $('#return-to').datepicker(
      'show',
    );
  });

  $('#btn-depart-from').click(() => {
    $('#depart-from').datepicker(
      'show',
    );
  });
});
