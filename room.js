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

module.exports = Room;
