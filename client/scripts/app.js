// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function () {
  this.fetch();
  setInterval( function() {
    app.fetch();
  }, 5000);
};

app.send = function (message) {

  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('Successfully added: ' + data);
      console.log(data);
    },
    error: function (data) {
      console.log('Unsuccessful');
    },
    complete: function() {
      app.addMessage(message);
      app.fetch();
    }
  });
};

app.fetch = function () {
  $.ajax({
    url: app.server + '?order=-createdAt',
    type: 'GET',
    success: this.displayMessages
  });
};

app.addMessage = function (message) {
  $('#chats').append("<li class='list-group-item'>" + "<strong>" + app.escapeHtml(message.username) + "</strong>: " + app.escapeHtml(message.text) + "</li>");
};

app.displayMessages = function (data) {
  app.clearMessages();
  app.messages = data.results;
  var elements = [];
  for (var i = 0; i < app.messages.length; i++) {
    //console.log(app.messages[i].username + " " + app.messages[i].objectId);
    if (app.messages[i]['username'] !== undefined) {
      elements.push("<li class='list-group-item'>" + "<strong>" + app.escapeHtml(app.messages[i]['username']) + "</strong>: " + app.escapeHtml(app.messages[i]['text']) + "</li>");
    }
  }
  $('ul').append(elements.join(''));
};

app.clearMessages = function () {
  $('#chats').empty();
};

app.addRoom = function (room) {
  $('#roomSelect').append('<li>' + room + '</li>');
};

app.escapeHtml = function (string) {
  var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
  };
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
};

app.init();
