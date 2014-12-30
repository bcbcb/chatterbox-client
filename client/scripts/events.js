$(document).ready(function () {

$('button').on('click', function () {
  var username = window.location.search.split('=')[1];
  var text = $('#chatMessage').val();

  var message = {
    'username' : username,
    'text' : text,
    'roomname' : 'Hack Reactor'
  };
  app.send(message);
  $('#chatMessage').val('');
});







});
