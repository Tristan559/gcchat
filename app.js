 
var sys = require('sys');
var net = require('net');
var User = require('./user');

var roomInitData = [
	{name: 'chat'},
	{name: 'hottub'}
];

var rooms = [];

Room = function(initData) {
	this.name = initData.name;
	this.users = [];
};

Room.init = function()
{
	for ( var i = 0; i < roomInitData.length; i++) {
		var room = new Room(roomInitData[i]);
		rooms.push(room);
		sys.puts('Added room: ' + room.name);
	}
};

Room.prototype.addUser = function(user) {
	// make sure user isnt already in this room
	if (this.users.indexOf(user) !== -1) {
		return false;
	}

	this.users.push(user);
	user.setRoom(this);

	this.broadcastMessage(user, user.username + " has joined the room.");
	return true;
};

// sends messages to all users in room except specific user
Room.prototype.broadcastMessage = function(user, message) {
	var len = this.users.length;

	for ( var i = 0; i < len; i++ ) {
		if (this.users[i] && this.users[i] !== user) {
			this.users[i].sendMessage(message);
		}
	}
};

Room.prototype.removeUser = function(user) {
	console.log('Room: removeUser()');
	this.broadcastMessage(user, user.username + " has left the room.");

	var idx = this.users.indexOf(user);

	if (idx !== -1) {
		this.users.splice(idx,1);
		console.log(this.name + ": remove user " + user.username);
	}

};

// join a specific room
Room.joinRoom = function(roomName, user) {
	var len = rooms.length;

	for (var i = 0; i < len; i++) {
		if(rooms[i].name === roomName) {
			var room = rooms[i];
			room.addUser(user);
			return true;
		}
	}

	return false;
};

// util function to compare user input with command
var compareCommand = function(userInput, command) {
	if(userInput.toLowerCase() == command + '\n') {
		return true;
	}

	return false;
};

var server = net.createServer(function(connection) {
	user = new User(connection);
	User.addUser(user);

    sys.puts('User connected: ' + connection.remoteAddress + ':' + connection.remotePort); 
    user.sendMessage('Welcome to Randy\'s Server!');
    user.sendMessage('Login Name?');
 
 	// user sends message
    connection.on('data', function(data) {
    	user = User.getUserByConnection(connection);

    	// strip newline chars from data
    	data = data.toString().replace(/(\r\n|\n|\r)/gm,"");

    	if ( user.loggedIn === false) {
    		if ( user.setUserName(data) === true ) {
	    		user.joinRoom('chat');
    		}
    	}
    	else {
	        if (data == 'exit') {
	            sys.puts('exit command received: ' + connection.remoteAddress + ':' + connection.remotePort + '\n');
	        	sys.puts(user.username + ' disconnected.');
	            user.connection.end('Goodbye!\n');
	            User.deleteUser(user);
	            return;
	        }

	        user.broadcastMessageToRoom(data);
    	}
    });
 
    connection.on('end', function() { // client disconnects
    	user = User.getUserByConnection(connection);
    	if ( user ) {
	        sys.puts(user.username + ' disconnected.');
	        User.deleteUser(user);
    	}
    });
});
 
var serveraddr = '127.0.0.1';
var serverport = 8080;
 
server.listen(serverport, serveraddr);
Room.init();
sys.puts('Server Created at ' + serveraddr + ':' + serverport + '\n');
