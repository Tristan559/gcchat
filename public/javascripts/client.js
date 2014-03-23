// connect to the socket server
var socket = io.connect();

// if we get an "info" emit from the socket server then console.log the data we recive
socket.on('info', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

socket.on('connect', function(data) {
	attemptLogin('Hello!');
});

socket.on('loginresult', function(data) {
	console.log('loginResult = ' + data.validLogin);

	if (data.validLogin === false) {
		attemptLogin('Name already taken or in use.');
	}
});

function attemptLogin(msg) {
	socket.emit('adduser', prompt(msg + " What's your name?") || '');
};