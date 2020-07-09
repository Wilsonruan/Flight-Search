$(document).ready(() => {
  $('#one-way, #roundtrip').click(function () {
    if ($('#one-way').prop('checked')) {
      $('#return-to').val('(One-Way)');
      $('#return-to').attr('disabled', true)
      $('#btn-return-to').attr('disabled', true)
      $('#return-to').attr('placeholder', '(One-Way)')
    } else if ($('#roundtrip').prop('checked')) {
      $('#return-to').val('');
      $('#return-to').attr('disabled', false)
      $('#btn-return-to').attr('disabled', false)
      $('#return-to').attr('placeholder', 'Returning..')
    }
  })
});