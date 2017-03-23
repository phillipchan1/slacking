var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var checker = require('./modules/checker');
var port = process.env.PORT || 80;

// connect to port
server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

// Routing
app.use('/', express.static('client/'));

var users = [];

io.on('connection', function(socket) {

    socket.on('user joins', function(username) {
        users.push(username)
        io.emit('user joins', username);
        io.emit('user list change', users);
    });

    socket.on('disconnect', function() {

    });

    socket.on('chat message', function(message) {
	    if (checker.check(message.userMessage)) {
	    	// buid a custom message

	    	let newMessage = {
	    		userMessage: checker.get(message.userMessage),
	    		username: message.username
	    	}

	    	io.emit('chat message', newMessage);
	    }
	    else {
	    	io.emit('chat message', message);
	    }
    });
});
