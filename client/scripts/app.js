// *
//  * Init
//  *   get list of rooms orederd by -createdAt
//  *   display rooms messages (HackReactor)
//  *   start setinterval
//  *     refresh messages for current room
//  *     refresh list of rooms
//  *       clearmessages
//  *       refetch
//  *
//  * Send
//  *   send via ajax to current room x
//  *   prepend to current room x
//  *
//  * UI
//  *   dropdown
//  *     show list of rooms
//  *     clicking on room switches room
//  *
//  *
//  *
//  *


var app = {};
app.room = 'HackReactor';
app.rooms;
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function () {
  this.fetch(app.room);
  app.rooms = this.getRooms();
  app.createDropDown(app.rooms);
  setInterval( function() {
    app.fetch(app.room);
    app.createDropDown(app.rooms);
  }, 5000);
};

app.fetch = function (room) {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {
      order: "-createdAt",
      where: { "roomname": room }
    },
    success: function (data) {
      // console.log(data.results);
      app.messages = data.results;
    },
    complete: app.displayMessages
  });
};

app.getRooms = function () {
  var rooms = {};
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {
      order: "-createdAt",
    },
    success: function (data) {
      //console.log(data.results);
      return roomStorage(data.results);
    }
  });

  var roomStorage = function (data) {

    for (var key in data) {
      var roomName = app.escapeHtml(data[key]['roomname']);

      if (rooms[roomName] === undefined) {
        rooms[roomName] = true;
      }
    }
  };

  return rooms;
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
    }
  });
};


app.addMessage = function (message) {
  $('#chats').prepend("<li class='list-group-item'>" + "<strong>" + app.escapeHtml(message.username) + "</strong>: " + app.escapeHtml(message.text)  + "</li>");
};

app.displayMessages = function () {
  app.clearMessages();
  var elements = [];
  for (var i = 0; i < app.messages.length; i++) {
    if (app.messages[i]['username'] !== undefined) {
      elements.push("<li class='list-group-item'>" + "<strong>" + app.escapeHtml(app.messages[i]['username']) + "</strong>: " + app.escapeHtml(app.messages[i]['text']) + "</li>");
    }
  }
  $('ul#chats').append(elements.join(''));
};

app.createDropDown = function (rooms) {
  $('#roomMenu').empty();
  var roomNames = [];
  var elements = [];
  for (var key in rooms) {
    roomNames.push(key);
  }
  for (var i = 0; i < roomNames.length; i++) {
    elements.push("<li><a href='#' class='roomName'>" + roomNames[i] + "</a></li>");
  }
  $("#roomMenu").append(elements.join(''));
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
    'roomname' : app.room
  };
  app.send(message);
  $('#message').val('');
};

app.init();
