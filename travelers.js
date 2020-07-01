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

  function controlAdultCount(adultCount) {
    if (adultCount >= 8) {
      $('#incrementAdult').attr('disabled', true);
      $('#decrementAdult').attr('disabled', false);
    } else if (adultCount <= 1) {
      $('#incrementAdult').attr('disabled', false);
      $('#decrementAdult').attr('disabled', true);
    } else {
      $('#incrementAdult').attr('disabled', false);
      $('#decrementAdult').attr('disabled', false);
    }
  }

  function controlChildCount(childCount) {
    if (childCount >= 8) {
      $('#incrementChild').attr('disabled', true);
      $('#decrementChild').attr('disabled', false);
    } else if (childCount <= 0) {
      $('#incrementChild').attr('disabled', false);
      $('#decrementChild').attr('disabled', true);
    } else {
      $('#incrementChild').attr('disabled', false);
      $('#decrementChild').attr('disabled', false);
    }
  }

  $('#decrementAdult').on('click', () => {
    let adultCount = parseInt($('#adultCount').html(), 10);
    adultCount -= 1;
    if (adultCount > 0) {
      $('#adultCount').html(adultCount);
      updateTravelerCount();
      controlAdultCount(adultCount);
    }
  });

  $('#incrementAdult').on('click', () => {
    let adultCount = parseInt($('#adultCount').html(), 10);
    if (adultCount < 8) {
      adultCount += 1;
      $('#adultCount').html(adultCount);
      updateTravelerCount();
      controlAdultCount(adultCount);
    }
  });

  $('#decrementChild').on('click', () => {
    let childCount = parseInt($('#childCount').html(), 10);
    childCount -= 1;
    if (childCount >= 0) {
      $('#childCount').html(childCount);
      updateTravelerCount();
      controlChildCount(childCount);
    }
  });

  $('#incrementChild').on('click', () => {
    let childCount = parseInt($('#childCount').html(), 10);
    if (childCount < 8) {
      childCount += 1;
      $('#childCount').html(childCount);
      updateTravelerCount();
      controlChildCount(childCount);
    }
  });
});
