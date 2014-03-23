// http://www.zhihua-lai.com/acm
// 09-Feb-2013
 
var sys = require('sys');
var net = require('net');
var users = [];

User = function(connection) {
	this.username = null;
	this.connection = connection;
	this.loggedIn = false;
};

// make sure name isn't already taken
User.validateUserName = function(username) {
	username = username.toLowerCase();

	for (var i = 0; i < users.length; i++) {
		if(users[i].username != null) {
			if (users[i].username.toLowerCase() === username) {
				return false;
			}
		} 

		return true;
	}
};

// sets user name on user if valid name, otherwise prompts user to try again
User.prototype.setUserName = function(username) {
	if (User.validateUserName(username) === true) {
		this.username = username;
		this.loggedIn = true;
		this.sendMessage('Welcome ' + username + '!');
	}
	else {
		user.sendMessage('Name Already Taken. Try another. ');
	}
};

User.prototype.Login = function(data) {

    sendMessage(this.connection, 'Login name?');
};

// sends message to specific user
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

// util function to compare user input with command
var compareCommand = function(userInput, command) {
	if(userInput.toLowerCase() == command + '\n') {
		return true;
	}

	return false;
};

var server = net.createServer(function(connection) {
	user = new User(connection);
	users.push(user);

    sys.puts('User connected: ' + connection.remoteAddress + ':' + connection.remotePort); 
    user.sendMessage('Welcome to Randy\'s Server!');
    user.sendMessage('Login Name?');
 
 	// user sends message
    connection.on('data', function(data) {
    	user = User.getUserByConnection(connection);

    	// strip newline chars from data
    	data = data.toString().replace(/(\r\n|\n|\r)/gm,"");

    	if ( user.loggedIn === false) {
    		user.setUserName(data);
    	}
    	else {
	        if (data == 'exit') {
	            sys.puts('exit command received: ' + connection.remoteAddress + ':' + connection.remotePort + '\n');
	            user.connection.destroy();
	            var idx = users.indexOf(user);
	            if (idx != -1) {
	                delete users[idx];
	            }
	            return;
	        }
	        var len = users.length;
	        for (var i = 0; i < len; i ++) { // broad cast
	            if (users[i] != user) {
	                if (users[i]) {
	                    users[i].sendMessage(user.username + ':' + data);
	                }
	            }
	        }
    	}
    });
 
    connection.on('end', function() { // client disconnects
    	user = User.getUserByConnection(connection);
        sys.puts('Disconnected: ' + data + data.remoteAddress + ':' + data.remotePort + '\n');
        var idx = users.indexOf(user);
        if (idx != -1) {
            delete users[idx];
        }
    });
});
 
var serveraddr = '127.0.0.1';
var serverport = 8080;
 
server.listen(serverport, serveraddr);
sys.puts('Server Created at ' + serveraddr + ':' + serverport + '\n');
