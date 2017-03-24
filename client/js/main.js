var socket = io();
var username = '';

// joining username
$('.username-input').on('keypress', function(e) {
    var self = $(this);
    if (e.which === 13 && self.val() !== '') {
        var nickname = self.val();

        if (nickname === '') {
            alert("Please enter a nickname before entering chatroom");
        } else {
            username = nickname;

            socket.emit('user joins', username);
            $('.app-title').fadeIn(500);
            $(".splash").fadeOut(500);
            $('.chat-window').fadeIn(500);
            $('.chat-window input').focus();
        }
    }
});


$('.chat-input').on('keypress', function(e) {
    var self = $(this);
    if (e.which === 13 && self.val() !== '') {
        var message = {};

        // message
        message.userMessage = self.val();
        // username
        message.username = username;
        socket.emit('chat message', message);

        self.val("");
    }
});

socket.on('chat message', function(message) {
    $('.message-list').append($('<li>').html(`<strong>${message.username}</strong>: ${message.userMessage}`));

  var embedVideoHtml = parseAndGetEmbedYoutubeHtml(message.userMessage);

  if (embedVideoHtml != null || embedVideoHtml != "") {
	  $('.message-list').append($('<li>').html(embedVideoHtml));
  }

    var messageList = document.querySelector(".message-list");
    messageList.scrollTop = messageList.scrollHeight;
});

function parseAndGetEmbedYoutubeHtml(messageText) {
	var patt = new RegExp(".*youtu\.be\/(.*)");

	var result = patt.exec(messageText);

	if (result != null) {
		return '<iframe width="420" height="315" src="https://www.youtube.com/embed/'+result[1]+'"></iframe>'
	}

	var patt2 = new RegExp(".*youtube\.com\/watch\?.*v\=([\w\d]*)")

	result = patt2.exec(messageText);

	if (result != null) {
		return '<iframe width="420" height="315" src="https://www.youtube.com/embed/'+result[1]+'"></iframe>'
	}
	
	var patt3 = new RegExp("((http|www).*(gif|jpg|jpeg|tiff|png))")

	result = patt3.exec(messageText);

	if (result != null) {
		return '<img src="'+result[1]+'">'
	}
	
	return "";
}


// user list
socket.on('user list change', function(numOfUsers) {
    $('.chat-room-info .number-of-users').text(numOfUsers);
});

// notifications
var notify = function(message) {
    var notification = $('.notification');
    notification.show();
    notification.text(message);
    setTimeout(function() {
        notification.fadeOut();
    }, 3000);
};

socket.on('user joins', function(message) {
    notify(`${message} has joined`);
});

socket.on('user disconnected', function(message) {
    notify(`${message} has disconnected`);
});

// on load
$(document).ready(function() {
    $('.splash').fadeIn(1000);
});
