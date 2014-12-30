var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function () {
  this.fetch();
  app.displayRooms();
  setInterval( function() {
    app.displayMessages();
  }, 5000);
};

app.send = function (message) {

  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('Successfully added');
    },
    error: function (data) {
      console.log('Unsuccessful');
    },
    complete: function() {
      app.addMessage(message);
      app.displayRooms();
    }
  });
};

app.fetch = function () {
  $.ajax({
    url: app.server + '?order=-createdAt',
    type: 'GET',
    success: this.displayMessages,
    complete: this.displayRooms
  });
};

app.addMessage = function (message) {
  //$('#chats').prepend("<li class='list-group-item'>" + "<strong>" + app.escapeHtml(message.username) + "</strong>: " + app.escapeHtml(message.text)  + "</li>");
  console.log(message['roomname']);
  var element = "<li class='list-group-item'>" + "<strong>" + app.escapeHtml(message['username']) + "</strong>: " + app.escapeHtml(message['text']) + "</li>";
  console.log(element);
  $('#' + message['roomname'] + ' ul').prepend(element);
  app.displayMessages();

};

app.displayMessages = function (data) {
  // app.clearMessages();
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
  $('.nav-tabs').empty();
  $('.tab-content ul').empty();
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

app.escapeRoom = function (string) {
  if (string.indexOf(" ") === 1) {
    string.split(' ').join('');
  }
  return string;
};

app.handleSubmit = function () {
  var username = window.location.search.split('=')[1];
  var text = $('#message').val();

  var message = {
    'username' : username,
    'text' : text,
    'roomname' : 'HackReactor'
  };
  app.send(message);
  $('#message').val('');
};


app.displayRooms = function () {
  app.clearMessages();
  var rooms = {};
  var message;

  for (var key in app.messages) {
    var roomName = app.escapeHtml(app.messages[key]['roomname']);
    var messageObj = app.messages[key];

    if (rooms[roomName] === undefined) {
      rooms[roomName] = [];
    }
    rooms[roomName].push(messageObj);
  }

  for (var room in rooms) {
    var tab = '<li role="presentation" class="tabber"><a href="#' + app.escapeHtml(room) + '" aria-controls="profile" role="tab" data-toggle="tab">' + app.escapeHtml(room) + '</a></li>';
    var tabPane = '<div role="tabpanel" class="tab-pane" id="' + app.escapeHtml(room) +'"><ul></ul></div>';
    var elements = [];
    $('.nav-tabs').append(tab);
    $('.tab-content').append(tabPane);

    for (var messageKey in rooms[room]) {
      message = rooms[room][messageKey];
      if (message['username'] !== undefined) {
        elements.push("<li class='list-group-item'>" + "<strong>" + app.escapeHtml(message['username']) + "</strong>: " + app.escapeHtml(message['text']) + "</li>");
      }
    }
    $('#' + room + ' ul').append(elements.join(''));
  }
};

app.init();
