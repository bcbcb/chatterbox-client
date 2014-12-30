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
  $('#chats').prepend("<li class='list-group-item'>" + "<strong>" + app.escapeHtml(message.username) + "</strong>: " + app.escapeHtml(message.text)  + "</li>");
};

app.displayMessages = function (data) {
  app.clearMessages();
  app.messages = data.results;
  var elements = [];
  for (var i = 0; i < app.messages.length; i++) {
    //console.log(app.messages[i].username + " " + app.messages[i].roomname) ;
    if (app.messages[i]['username'] !== undefined) {
      elements.push("<li class='list-group-item'>" + "<strong>" + app.escapeHtml(app.messages[i]['username']) + "</strong>: " + app.escapeHtml(app.messages[i]['text']) + "</li>");
    }
  }
  $('ul#chats').append(elements.join(''));
};

app.clearMessages = function () {
  $('#chats').empty();
};

app.addRoom = function (room) {
  $('#roomSelect').append('<li>' + room + '</li>');
};

app.escapeHtml = function (string) {
  // return string;
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

app.handleSubmit = function () {
  var username = window.location.search.split('=')[1];
  var text = $('#message').val();

  var message = {
    'username' : username,
    'text' : text,
    'roomname' : 'Hack Reactor'
  };
  app.send(message);
  $('#message').val('');
};


app.displayRooms = function () {
//Iterate through the objects on the GET request
  var rooms = {};
  var message;

  for (var key in app.messages) {
    //Create an object to store all room names
    if (rooms[app.messages[key]['roomname']] === undefined) {
      rooms[app.messages[key]['roomname']] = [];
    }
    rooms[app.messages[key]['roomname']].push(app.messages[key]); //increment if the key already exists
  }

  for (var room in rooms) {
    var tab = '<li role="presentation" class="tabber"><a href="#' + room + '" aria-controls="profile" role="tab" data-toggle="tab">' + room + '</a></li>';
    var tabPane = '<div role="tabpanel" class="tab-pane" id="' + room +'"><ul></ul></div>';
    var elements = [];
    $('.nav-tabs').append(tab);
    $('.tab-content').append(tabPane);

    for (var messageKey in rooms[room]) {
      console.log(rooms[room][messageKey]);
      message = rooms[room][messageKey];
      if (message['username'] !== undefined) {
        elements.push("<li class='list-group-item'>" + "<strong>" + app.escapeHtml(message['roomname']) + "</strong>: " + app.escapeHtml(message['text']) + "</li>");
      }
    }
    $('#' + room + ' ul').append(elements.join(''));
  }
};

app.init();
