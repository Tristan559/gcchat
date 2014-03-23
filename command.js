var Room = require('./room');

var helpDisplay = '';

var chatCommands = [
	{name: '/help', callback: 'showHelp', description: '- list of commands'},
	{name: '/join', callback: 'joinRoom', description: '[room name] - join specific chat room'},
	{name: '/rooms', callback: 'roomList', description: '- list of available chat rooms'},
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

Command.showHelp = function(user, params) {
	user.sendMessage(helpDisplay);
	console.log('Command: showHelp');
};

Command.joinRoom = function(user, params) {
	console.log('Command: joinRoom');
};

Command.roomList = function(user, params) {
	Room.displayRoomList(user);
	console.log('Command: roomList');
};

Command.exitChat = function(user, params) {
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
				callback(user, params);
				return true;
			}
		}
	}

	return false;
};

module.exports = Command;
