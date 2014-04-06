
var net = require('net');
var User = require('./user');
var Room = require('./room');
var Command = require('./command');

var serverport = 8080;

var server = net.createServer(function(connection) {

	var user = new User(connection);
	User.addUser(user);

    console.log('User connected: ' + connection.remoteAddress + ':' + connection.remotePort); 
    user.sendMessage('Welcome to Randy\'s Server!');
    user.sendMessage('Login Name?');
 
 	// user sends message
    connection.on('data', function(data) {
    	user = User.getUserByConnection(connection);

    	// strip newline chars from data & trim whitespace from end
    	data = data.toString().replace(/(\r\n|\n|\r)/gm,"");
    	data = data.replace(/\s+$/,'');

    	if ( user.loggedIn === false) {
    		if ( user.setUserName(data) === true ) {
    			user.logIn();
    		}
    	}
    	else {
    		// look for command. if found, process
    		var command = Command.parseStringForCommand(user, data);

    		if ( command ) {
    			// need to handle exit command on this side
		        if (command === '/exit') {
		        	console.log(user.username + ' exited chat.');
		            user.connection.end('Goodbye!\n');
		            User.deleteUser(user);
		            return;
		        }
    		}
    		else {
		        user.broadcastMessageToRoom(data);
    		}

    	}
    });
 
 	// user may get disconnected. This throws connection reset errors
 	// when node tries to grab data from now disconnected socket
 	// this handles these cases and removes now defunct users
 	connection.on('close', function(had_error) {
 		if (had_error === true) {
 			console.log('connection closed due to error.');
 			user = User.getUserByConnection(connection);

 			if ( user ) {
 				User.deleteUser(user);
 			}
 		}
 	});
 	
    connection.on('end', function() { // client disconnects
    	user = User.getUserByConnection(connection);
    	if ( user ) {
	        console.log(user.username + ' disconnected.');
	        User.deleteUser(user);
    	}
    });

    // handle connection errors
    connection.on('error', function(err) {
		console.log('connection error. code: ' + err.code);
		console.log(err.stack);
    });

});

// error handling
server.on('error', function(err) {
	if (err.code === 'EADDRINUSE') {
		console.log('Address in use, retrying...' + err.code);
		setTimeout(function () {
			try {
				server.close();
			} catch (err) {
				console.log('server close: ' + err.code);
			}
			server.listen(serverport);
		}, 1000);
	}
	else {
		console.log('server error. code: ' + err.code);
		console.log(err.stack);
	}
});
 
server.listen(serverport);
Room.init();
Command.init();
console.log('Server Created using port ' + serverport + '\n');
