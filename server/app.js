var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var checker = require('./modules/checker');
var port = process.env.PORT || 80;
var parser = require('body-parser');
var youtube = require('./modules/youtube');

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

// connect to port
server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

// Routing
app.use('/', express.static('client/'));

io.on('connection', function(socket) {
	var users = 0;

    socket.on('user joins', function() {
        users = users + 1;
        io.emit('user list change', users);
    });

    socket.on('disconnect', function() {
    	users = users - 1;
    	io.emit('user list change', users);
    });

    socket.on('chat message', function(message) {
	    if (checker.check(message.userMessage)) {
	    	// buid a custom message

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
