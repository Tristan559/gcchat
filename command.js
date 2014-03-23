var Room = require('./room');

var helpDisplay = '';

var chatCommands = [
	{name: '/help', callback: 'showHelp', description: '- list of commands'},
	{name: '/join', callback: 'joinRoom', description: '[room name] - join specific chat room'},
	{name: '/rooms', callback: 'roomList', description: '- list of available chat rooms'},
	{name: '/users', callback: 'userList', description: '- lists users in room'},
	{name: '/pm', callback: 'privateMessage', description: '[user] [message] - send private message to user'},
	{name: '/exit', callback: 'exitChat', description: '- quits chat and end connection'}
];

Command = function()
{
};

Command.init = function() {
	Command.initHelpDisplay();
};

Command.initHelpDisplay = function() {
	var help = 'Chat commands:\n';

	for (var i = 0; i < chatCommands.length; i++) {
		help = help + chatCommands[i].name + ' ' + chatCommands[i].description;

		// add newline except for last line
		if ( i < chatCommands.length-1) {
			help = help + '\n';
		}
	}

	helpDisplay = help;
};

Command.showHelp = function(user, args) {
	var params = args['params'];
	user.sendMessage(helpDisplay);
	console.log('Command: showHelp');
};

// send private message to user
Command.privateMessage = function(user, args) {
	var params = args['params'];
	if ( params.length < 3 ) {
		user.sendMessage('/pm: invalid params');
		return false;
	}

	// get target user of private message
	targetUserName = params[1];
	targetUser = User.findByName(targetUserName);

	if ( !targetUser ) {
		user.sendMessage('User \'' + targetUserName + '\'' + ' not found.');
		return false;
	}

	// we grab the start of the user input at the second param
	// since params are separated by whitespace, params[2] will only
	// contain first word of message, but that's enough to find the start of
	// the message in the user's input
	var idx = args['userInput'].indexOf(params[2]);
	var message = user.username + '==>' +  targetUser.username + ':' + args['userInput'].substr(idx);

	// send message to both sender and recipient
	user.sendMessage(message);
	targetUser.sendMessage(message);

	return true;
};

Command.joinRoom = function(user, args) {
	var params = args['params'];

	var roomName = params[1] || '';

	if ( user.joinRoom(roomName) === false ) {
		user.sendMessage('Room \'' + roomName + '\'' + ' not found.');
	}

	console.log('Command: joinRoom. Room requested: ' + params[1]);
};

Command.userList = function(user, args) {
	var params = args['params'];
	Room.displayUsers(user);
};

Command.roomList = function(user, args) {
	var params = args['params'];
	Room.displayRoomList(user);
	console.log('Command: roomList');
};

// nothing to do here. This is a special command that will be handle by app.js
Command.exitChat = function(user, args) {
	var params = args['params'];
	console.log('Command: exitChat');
};

// search user's text for commands
Command.parseStringForCommand = function(user, userInput) {
	params = userInput.split(" ");

	var len = chatCommands.length;

	for (var i = 0; i < len; i++) {
		if(params[0] && params[0].toLowerCase() === chatCommands[i].name) {
			callback = Command[chatCommands[i].callback];

			if(callback) {
				callback(user, {params: params, userInput: userInput});
			}

			// return command
			return params[0].toLowerCase();;

		}
	}

	// return null
	return null;
};

module.exports = Command;
