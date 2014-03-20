// connect to the socket server
var socket = io.connect();

// if we get an "info" emit from the socket server then console.log the data we recive
socket.on('info', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

socket.on('connect', function(data) {
	socket.emit('adduser', prompt("What's your name?"));
});
