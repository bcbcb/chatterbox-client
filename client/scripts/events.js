$(document).ready(function () {

  $('.submit').on('click', app.handleSubmit);

  $('.tabber a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  $('body').on('click', '#roomMenu .roomName', function (e) {
    e.preventDefault();
    console.log($(this).text());
    app.fetch($(this).text());
    app.room = $(this).text();
    $('h1').text(app.room);
  });
});
