var youtube = require('./youtube');

var activate = function(io, interval) {
	setInterval(function() {
		youtube.getRandomVideoLink(function(link) {
			var message = {
				userMessage: "hey, here's something to keep you busy: " + link,
				username: "Slackbot"
			};

			io.emit('chat message', message);
		});
	}, interval);
};

module.exports = {
	activate: activate
};