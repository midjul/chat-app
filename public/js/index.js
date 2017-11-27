const socket = io();

socket.on("newMessage", message => {
  console.log("Message: ", message);
});
