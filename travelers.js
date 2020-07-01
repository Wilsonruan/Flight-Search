// No of travelers drop-down
$(document).ready(() => {
  $(document).mouseup((e) => {
    if ($(e.target).closest('.travelerClass').length === 0) {
      $('.travelerClass').hide();
    }
  });

  $('#travelers').click(() => {
    $('.travelerClass').slideToggle(150, () => ($('.travelerClass').is(':visible') ? 'Collapse' : 'Expand'));
  });

  function updateTravelerCount() {
    const adultCount = parseInt($('#adultCount').html(), 10);
    const childCount = parseInt($('#childCount').html(), 10);
    const travelerCount = adultCount + childCount;
    const travelerHtml = travelerCount === 1 ? `${travelerCount} traveler` : `${travelerCount} travelers`;
    $('#travelers').val(travelerHtml);
  }

  $('#decrementAdult').on('click', () => {
    let adultCount = parseInt($('#adultCount').html(), 10);
    adultCount -= 1;
    if (adultCount > 0) {
      $('#adultCount').html(adultCount);
      updateTravelerCount();
    }
  });

  $('#incrementAdult').on('click', () => {
    let adultCount = parseInt($('#adultCount').html(), 10);
    adultCount += 1;
    $('#adultCount').html(adultCount);
    updateTravelerCount();
  });

  $('#decrementChild').on('click', () => {
    let childCount = parseInt($('#childCount').html(), 10);
    childCount -= 1;
    if (childCount >= 0) {
      $('#childCount').html(childCount);
      updateTravelerCount();
    }
  });

  $('#incrementChild').on('click', () => {
    let childCount = parseInt($('#childCount').html(), 10);
    childCount += 1;
    $('#childCount').html(childCount);
    updateTravelerCount();
  });
});
