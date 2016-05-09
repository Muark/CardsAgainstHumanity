Chats = new Mongo.Collection("chats");
Games = new Mongo.Collection("games");

Router.route('/', {
    template: 'home'
});
Router.route('/register');
Router.route('/login');
Router.route('/game');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("chats", function () {
    return Chats.find();
  });

  Meteor.publish("games", function () {
    return Games.find();
  });
}

if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("chats");
  Meteor.subscribe("games");

  var gimma = Games.find({player_6_id: "39bgFjT5pgMCHbqDr"});

  Session.set('gameId', gimma['player_6_id']);
  alert(Session.get('gameId'));

  Template.home.helpers({
    chats: function () {
      return Chats.find({}, {sort: {createdAt: -1}, limit:20});
    }
  });

  Template.home.helpers({
    games: function () {
      return Games.find({}, {sort: {createdAt: 1}});
    }
  });
 
  Template.home.events({
    "submit .new-chat": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a task into the collection
      Meteor.call("addChat", text);
 
      // Clear form
      event.target.text.value = "";
    }
  });

  Template.home.events({
    "click .myButton": function (event) {
      Meteor.call("addGame");
    }
  });

  Template.home.events({
    "click .myButton2": function (event) {
      var gameId = this._id;
      var players = this.players;
      Meteor.call("joinGame", gameId, players);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.game.helpers({
    games: function () {
      return Games.find({_id: 'Kv5hG333fYiJbvGNw'}, {sort: {createdAt: 1}});
    }
  });
}

Meteor.methods({
  addChat: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Chats.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username || Meteor.user().profile.name
    });
  }
});

Meteor.methods({
  addGame: function () {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Games.insert({
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username || Meteor.user().profile.name,
      player_1_id: Meteor.userId(),
      player_2_id: null,
      player_3_id: null,
      player_4_id: null,
      player_5_id: null,
      player_6_id: null,
      player_1_name: Meteor.user().username || Meteor.user().profile.name,
      player_2_name: null,
      player_3_name: null,
      player_4_name: null,
      player_5_name: null,
      player_6_name: null,      
      player_1_score: null,
      player_2_score: null,
      player_3_score: null,
      player_4_score: null,
      player_5_score: null,
      player_6_score: null,
      players: '1',
      round: '1',
      status: 'open'
    });
  }
});

Meteor.methods({
  joinGame: function (gameId, players) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    if (players == '1') {
      Games.update(gameId, {$set: {player_2_id: Meteor.userId(), player_2_name: Meteor.user().username || Meteor.user().profile.name, players: 2} });
    } else if (players == '2') {
      Games.update(gameId, {$set: {player_3_id: Meteor.userId(), player_3_name: Meteor.user().username || Meteor.user().profile.name, players: 3} });
    } else if (players == '3') {
      Games.update(gameId, {$set: {player_4_id: Meteor.userId(), player_4_name: Meteor.user().username || Meteor.user().profile.name, players: 4} });
    } else if (players == '4') {
      Games.update(gameId, {$set: {player_5_id: Meteor.userId(), player_5_name: Meteor.user().username || Meteor.user().profile.name, players: 5} });
    } else if (players == '5') {
      Games.update(gameId, {$set: {player_6_id: Meteor.userId(), player_6_name: Meteor.user().username || Meteor.user().profile.name, players: 6} });
    }
  }
});