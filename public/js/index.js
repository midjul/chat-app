const socket = io();

socket.on("newMessage", message => {
  console.log("Message: ", message);
});

socket.emit("createMessage", { from: "connected@user.com", text: "Hello" });
