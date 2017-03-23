var socket = io();

$('.chat-input').on('keypress', function (e) {
	var self = $(this);
     if(e.which === 13){

        //Disable textbox to prevent multiple submit
        var message = self.val();
        socket.emit('chat message', message);

        self.val("");
     }
});