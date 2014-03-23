 
var sys = require('sys');
var net = require('net');
var User = require('./user');
var Room = require('./room');

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

    console.log('User connected: ' + connection.remoteAddress + ':' + connection.remotePort); 
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
	            console.log('exit command received: ' + connection.remoteAddress + ':' + connection.remotePort + '\n');
	        	console.log(user.username + ' disconnected.');
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
	        console.log(user.username + ' disconnected.');
	        User.deleteUser(user);
    	}
    });
});
 
var serveraddr = '127.0.0.1';
var serverport = 8080;
 
server.listen(serverport, serveraddr);
Room.init();
console.log('Server Created at ' + serveraddr + ':' + serverport + '\n');
