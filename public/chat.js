
$(function(){
//make connection
 var socket = io.connect('https://secret-caverns-47230.herokuapp.com/')

 //buttons and inputs
 var message = $("#message")
 var username = $("#username")
 var send_message = $("#send_message")
 var send_username = $("#send_username")
 var chatroom = $("#chatroom")
 var feedback = $("#feedback")
 var chat_history = $("#chat_history")

 //Emit message
 send_message.click(function(){
     socket.emit('new_message', {message : message.val()})
 })

 //
 chat_history.click(function(){
     socket.emit('chat_history')
 })

 //Listen on new_message
 socket.on("new_message", (data) => {
     feedback.html('');
     message.val('');
     chatroom.append("<p class='message'>" + data.sender + ": " + data.message + "</p>")
 })

 //Emit a username
 send_username.click(function(){
     socket.emit('change_username', {username : username.val()})
 })

 //Emit typing
 message.bind("keypress", () => {
     socket.emit('typing')
 })

 //Listen on typing
 socket.on('typing', (data) => {
     feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
 })

 //Listen on Disconnect
 socket.on("disconnect", function(){
     console.log("Disconnected...");
 })
});




