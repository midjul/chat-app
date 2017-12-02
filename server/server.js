const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback("Name and room name are required.");
    }
    socket.join(params.room);

    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app")
    );
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} hase joined.`)
      );
    callback();
  });
  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });

  socket.on("createMessage", (message, callback) => {
    console.log("Create Message", message);
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback();
  });
  socket.on("createLocationMessage", (coords, callback) => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
    callback();
  });
});

server.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
