const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
const { generateMessage, generateLocationMessage } = require("./utils/message");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the chat app")
  );
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user joined")
  );
  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });

  socket.on("createMessage", (message, callback) => {
    console.log("Create Message", message);
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback("This is from the server");
  });
  //https://www.google.com/maps?q=
  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });
});

server.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
