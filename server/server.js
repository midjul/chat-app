const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");
  socket.emit("newMessage", {
    text: "Welcome to the chat app",
    from: "Admin",
    createdAt: new Date().getTime()
  });
  socket.broadcast.emit("newMessage", {
    text: "New user joined",
    from: "Admin",
    createdAt: new Date().getTime()
  });
  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });

  socket.on("createMessage", message => {
    console.log("Create Message", message);
    io.emit("newMessage", { ...message, createdAt: new Date().getTime() });

    //    socket.broadcast.emit("newMessage", {...message, createdAt: new Date().getTime()});
  });
});

server.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
