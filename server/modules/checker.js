var keywords = require('./keywords');

var check = function(message) {
	for (var key in keywords) {
		if (message.toLowerCase().includes(key)) {
			return true;
		}
	}

	return false;
}

var get = function(message) {
	for (var key in keywords) {
		if (message.toLowerCase().includes(key)) {
			return keywords[key];
		}
	}

	return '';
}

module.exports = {
	check:check,
	get:get
}