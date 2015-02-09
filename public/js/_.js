$(document).ready(function () {
/*  $.getJSON('/menu.json', function(data) {
    $.each(data, function(key, val) {
      $('#sidebar').append($('a').attr('href', '/?sec=' + key).text(val));
    });
  }); */
  var nearestSecId = $('section:first').attr('id');
  $(window).scroll(function() {
    $('section').each(function(i) {
      var temp = Math.abs($(this).offset().top - $(window).scrollTop());
      if (i == 0) nearestSecPos = temp;
      if (nearestSecPos >= temp) {
        nearestSecPos = temp;
        nearestSecId = $(this).attr('id');
      }
    });
  });
  function em(input) {
    var emSize = parseFloat($("body").css("font-size"));
    return (emSize * input);
  }
  margin = -em(4);
  $('button').click(function() {
    if($(this).hasClass('next')) {
      $target = $('#' + nearestSecId).next('section');
    } else if ($(this).hasClass('prev')) {
      $target = $('#' + nearestSecId).prev('section');
    }
    var pos = $target.offset().top;
    $('html, body').animate({
      scrollTop: pos + margin
    }, {
      queue: false
    });
  });
});
