var https = require('https');
var Youtube = require("youtube-api");

let oauth = Youtube.authenticate({
    type: "oauth",
    client_id: '100172283741-qbg82ok4mka4g40napbq21cjgshki7s1.apps.googleusercontent.com',
    client_secret: 'C5h-YwAGHpbFZwSQ82yIUuXA'

});

var getRandomVideoLink = function(callback) {
	return https.get({
        host: 'www.googleapis.com',
        path: '/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PLhOYRw2LCXIa4Wcm3EZvO9vl3O8S1evEy&key=AIzaSyBNFrDvjjiF1ds6UZrX-G0KHGZxss98Kmg'
    }, function(response) {

    	var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	  	var listJSON = JSON.parse(str);

	  	var randomIndex = randomIntFromInterval(0, listJSON.items.length);
	  	var randomVideoId = listJSON.items[randomIndex].snippet.resourceId.videoId;

	  	console.log(randomVideoId);


	  	callback(buildYouTubeLink(randomVideoId));
	  });
    });
};

var buildYouTubeLink = function(videoID) {
	return 'https://www.youtube.com/watch?v=' + videoID;
};

var randomIntFromInterval = function(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};




module.exports = {
	getRandomVideoLink: getRandomVideoLink
}