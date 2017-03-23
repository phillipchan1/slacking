var socket = io();
var username = '';

// joining username
$('.username-input').on('keypress', function(e) {
    var self = $(this);
    if (e.which === 13 && self.val() !== '') {
        var nickname = self.val();

        console.log(nickname);
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
    $('.message-list').append($('<li>').text(`${message.username}: ${message.userMessage}`));

  var embedVideoHtml = parseAndGetEmbedYoutubeHtml(message.userMessage)
  
  if (embedVideoHtml != null || embedVideoHtml != "") {
	  $('.message-list').append($('<li>').text(`${embedVideoHtml}')
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
	
	var patt2 = new RegExp(".*youtube\.com\/watch\?.*v\=(.*).*")
	
	result = patt2.exec(messageText);
	
	if (result != null) {
		return '<iframe width="420" height="315" src="https://www.youtube.com/embed/'+result[1]+'"></iframe>'
	}
	
	return ""
}


// user list
socket.on('user list change', function(userlist) {
    updateUserList(userlist);
});

socket.on('disconnect', function() {
    socket.emit('remove user', 'remove me please')
});

var updateUserList = function(userlist) {
    $('.chat-room-info .number-of-users').text(userlist.length);
};

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



// on load
$(document).ready(function() {
    $('.splash').fadeIn(1000);
});
