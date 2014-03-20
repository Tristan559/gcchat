/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , clientObject = require('./client');
;

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server); // this tells socket.io to use our express server

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

// valid names for logging in
var validNames = [

	'gcreviewer',
	'randy'
];



// client object
var client = new clientObject({
	validNamesArray: validNames
});

console.log("Express server listening on port 3000");

io.sockets.on('connection', function (socket) {
    console.log('A new user connected!');
    socket.emit('info', { msg: 'The world is round, there is no up or down.' });

    socket.on('my other event', function(data) {
    		console.log('client sent: ' + data.my);
    });

    // user join attempt
    socket.on('adduser', function(username) {
    	console.log ('user add result = ' + client.verifyLogin(username));
    	console.log('user ' + username + " connected!");
    });
});
