var users = [];

User = function(connection) {
	this.username = null;
	this.connection = connection;
	this.loggedIn = false;
	this.room = null;
};

// finds user by name
// returns found user or null if no matching name
User.findByName = function(username) {
	username = username.toLowerCase();

	var len = users.length;
	for (var i = 0; i < len; i++) {
		if(users[i] !== user && users[i].username) {
			if (users[i].username.toLowerCase() === username) {
				return users[i];
			}
		}
	}

	return null;
};

// make sure name isn't already taken
// returns true if name is valid (not already in use), false if name is duplicate
User.prototype.validateUserName = function(username) {
	if ( username.length < 3 ) {
		this.sendMessage('Name must be at least 3 characters in length.');
		return false;
	}

	if ( User.findByName(username) ) {
		this.sendMessage('Name already in use.');
		return false;
	}

	if ( username.length > 32 ) {
		this.sendMessage('Name must be max of 32 characters.');
		return false;
	}

	// check for valid characters
	var matchexpr = /[\w\s]+/;
	console.log('checking \'' + username + '\' with \'' + username.match(matchexpr) + '\'');
	if(username.match(matchexpr) != username) {
		this.sendMessage('Invalid name. No special characters allowed in name.');
		return false;
	}
	return true;
};

// sets user name on user if valid name, otherwise prompts user to try again
User.prototype.setUserName = function(username) {
	if (this.validateUserName(username) === true) {
		this.username = username;
		return true;
	}

	return false;
};

// sends message to this user
User.prototype.sendMessage = function(message) {
	this.connection.write(message + '\n');
};

// returns user with matching connection
User.getUserByConnection = function(connection) {
	var len = users.length;

	for ( var i = 0; i < len; i++ ) {
		if(users[i] && users[i].connection === connection) {
			return users[i];
		}
	}

	// no user with matching connection
	return null;
};

// adds user to users array
User.addUser = function(user) {
	users.push(user);
};

User.deleteUser = function(user) {
	console.log('User: deleteUser()');
	// remove us from the room
	if (user.room) {
		user.room.removeUser(user);
		user.room = null;
	}

    var idx = users.indexOf(user);
    if (idx !== -1) {
        users.splice(idx,1);
    }
};

// 'logs in' user, sets initial room and displays welcome message
User.prototype.logIn = function() {
	this.loggedIn = true;
	this.sendMessage('Welcome ' + this.username + '!');
	this.joinRoom('chat');
	this.sendMessage('type /help for list of commands.');
};

User.prototype.setRoom = function(room) {
	this.room = room;
	console.log(this.username + ": room set to " + room.name);
};

User.prototype.broadcastMessageToRoom = function(message) {
	this.room.broadcastMessage(null, this.username + ':' + message);
};

User.prototype.joinRoom = function(roomName) {
	if ( Room.joinRoom(roomName, this) === true ) {
		return true;
	}
	return false;
};

module.exports = User;
