var keywords =  require('./keywords');

check = function(keyword) {
	if (keywords[keyword]) {
		return keywords[keyword];
	} else {
		return false;
	}
};