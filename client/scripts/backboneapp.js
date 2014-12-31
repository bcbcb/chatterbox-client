var Message = Backbone.Model.extend({

});

var Messages = Backbone.Collection.extend({
  model: Message,

  url: 'https://api.parse.com/1/classes/chatterbox',

  loadMessages: function () {
    this.fetch({data: {order: '-createdAt'}});
  },

  parse: function (response) {
    var messages = response.results;
    return messages;
  }

});

var MessageView = Backbone.View.extend({
  template: _.template("<li class='list-group-item'><strong class='username'> \
                        <%- username %></strong>: <%- text %></li>"),
  render: function () {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
});

var MessagesView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('sync', this.render, this);
  },

  render: function() {
    this.collection.forEach(this.renderMessage, this);
  },

  renderMessage: function (message) {
    var messageView = new MessageView({model: message});
    this.$el.prepend(messageView.render());
  }


});
