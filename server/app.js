var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var checker = require('./modules/checker');
var port = process.env.PORT || 80;
var parser = require('body-parser');
var youtube = require('./modules/youtube');
var slackbot = require('./modules/slackbot');

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

// connect to port
server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

// Routing
app.use('/', express.static('client/'));

var socketIds = {};

io.on('connection', function(socket) {

    socket.on('user joins', function(username) {

        socketIds[socket.id] = username;
        io.emit('user joins', username);
        io.emit('user list change', Object.keys(socketIds).length);
    });

    socket.on('disconnect', function() {
		if (socketIds.hasOwnProperty(socket.id)){
			io.emit('user disconnected', socketIds[socket.id]);
			delete socketIds[socket.id];
		}

    	io.emit('user list change', Object.keys(socketIds).length);
    });

    socket.on('chat message', function(message) {
	    if (checker.check(message.userMessage)) {
	    	youtube.getRandomVideoLink(function(link) {
				let newMessage = {
		    		userMessage: checker.getMessage(message.userMessage) + ' ' + link,
		    		username: message.username
		    	};

		    	io.emit('chat message', newMessage);
			});
	    }
	    else {
	    	io.emit('chat message', message);
	    }
    });
});

slackbot.activate(io, 30000);