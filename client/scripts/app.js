// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function () {
  this.fetch();
};

app.send = function (message) {

  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('Successfully added: ' + data);
    },
    error: function (data) {
      console.log('Unsuccessful');
    },
    complete: app.fetch
  });
};

app.fetch = function () {

  $.ajax({
    url: app.server,
    type: 'GET',
    success: this.displayMessages
  });
};

app.displayMessages = function (data) {
  app.messages = data.results;
  var elements = [];
  for (var i = 0; i < app.messages.length; i++) {
    if (app.messages[i]['username'] !== undefined) {
      elements.push("<li class='list-group-item'>" + "<strong>" + app.messages[i]['username'] + "</strong>: " + app.messages[i]['text']);
    }
  }
  $('ul').append(elements.join(''));
};

app.init();
