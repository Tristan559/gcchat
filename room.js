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
		console.log('Added room: ' + room.name);
	}
};

// lists users in a room
Room.displayUsers = function(user) {
	var room = user.room;

	if ( room ) {
		var userList = 'Active users in room \'' + room.name + '\'\n';
		var len = room.users.length;
		var prefix;

		for (var i = 0; i < len; i++) {
			if (room.users[i] === user) {
				prefix = '* ';
			} else {
				prefix = '  ';
			}

			userList = userList + prefix + room.users[i].username;

			if ( i < len-1 ) {
				userList = userList + '\n';
			}
		}

		user.sendMessage(userList);
	}
};

// displays list of rooms (and user count per room) to requesting user
Room.displayRoomList = function(user) {
	var output = 'Available Rooms:\n';
	var prefix;

	for ( var i = 0; i < rooms.length; i++) {
		// add a star in front of room that user is currently in
		if ( rooms[i] === user.room ) {
			prefix = '* ';
		} else {
			prefix = '  ';
		}
		output = output + prefix + rooms[i].name + '(' + rooms[i].users.length + ')';

		// add newline except for last line
		if ( i < rooms.length - 1 ) {
			output = output + '\n';
		}
	}

	user.sendMessage(output);
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
	}

};

// join a specific room
Room.joinRoom = function(roomName, user) {
	var len = rooms.length;

	for (var i = 0; i < len; i++) {
		if(rooms[i].name === roomName) {
			var room = rooms[i];

			// see if user is trying to join room they are already in
			if ( room === user.room ) {
				user.sendMessage('You are already in room \'' + room.name + '\'');
				return true;
			}

			// remove user form their old room
			if ( user.room ) {
				user.room.removeUser(user);
			}
			room.addUser(user);
			user.sendMessage('Joining room \'' + roomName + '\'');
			Room.displayUsers(user);

			return true;
		}
	}

	return false;
};

module.exports = Room;
