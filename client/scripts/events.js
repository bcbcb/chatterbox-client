$(document).ready(function () {

  $('.submit').on('click', app.handleSubmit);

  $('.tabber a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

});
