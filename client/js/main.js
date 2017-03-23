var socket = io();
var username = 'phil';
// join chat room
socket.emit('user joins', username);

$('.chat-input').on('keypress', function (e) {
	var self = $(this);
     if(e.which === 13 && self.val() !== ''){
     	var message = {};

        // message
        message.userMessage = self.val();
        // username
        message.username = username;
        socket.emit('chat message', message);

        self.val("");
     }
});

socket.on('chat message', function(message){
  $('.message-list').append($('<li>').text(`${message.username}: ${message.userMessage}`));

  var messageList = document.querySelector(".message-list");
	messageList.scrollTop = messageList.scrollHeight;
});

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
	}, 2000);
};

socket.on('user joins', function(message) {
	notify(`${message} has joined`);
});

// notify('has joined the room')