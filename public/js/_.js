$(document).ready(function () {
  $.getJSON('/menu.json', function(data) {
    $.each(data, function(key, val) {
      $('#sidebar').append($('<a/>').attr('href', '/?chap=' + key).text(val));
    });
  });
  var nearestSec = $('section:first');
  $(window).scroll(function() {
    $('section').each(function(i) {
      var temp = Math.abs($(this).offset().top - $(window).scrollTop());
      if (i == 0) nearestSecPos = temp;
      if (nearestSecPos >= temp) {
        nearestSecPos = temp;
        $nearestSec = $(this);
      }
    });
  });
  function em(input) {
    var emSize = parseFloat($("body").css("font-size"));
    return (emSize * input);
  }
  $('button').click(function() {
    if($(this).hasClass('next')) {
      $target = $nearestSec.next('section');
    } else if ($(this).hasClass('prev')) {
      $target = $nearestSec.prev('section');
    }
    var pos = $target.offset().top;
    if($target.offset()){
      $('html, body').animate({
        scrollTop: pos - em(2)
      }, {
        queue: false
      });
    }
  });
  $('body').keydown(function (e) {
    switch(e.which) {
    case 37:
      $target = $nearestSec.prev('section');
      break;
    case 39:
      $target = $nearestSec.next('section');
      break;
    default: return;
    }
    if($target.offset()) {
      var pos = $target.offset().top;
      $('html, body').animate({
        scrollTop: pos - em(2)
      }, {
        queue: false
      });
    }
    e.preventDefault();
  });
});
