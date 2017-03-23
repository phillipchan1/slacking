var socket = io();

$('.chat-input').on('keypress', function (e) {
	var self = $(this);
     if(e.which === 13){
     	var message = {};

        //Disable textbox to prevent multiple submit
        message.userMessage = self.val();
        socket.emit('chat message', message);

        self.val("");
     }
});

socket.on('chat message', function(message){
  $('.message-list').append($('<li>').text(message.userMessage));

  var messageList = document.querySelector(".message-list");
	messageList.scrollTop = messageList.scrollHeight;
});

