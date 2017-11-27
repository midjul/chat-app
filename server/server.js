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

  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });

  socket.emit("newMessage", {
    from: "user@123.com",
    text: "Some important message",
    createdAt: new Date().getTime()
  });

  socket.on("createMessage", message => {
    console.log("Create Message", message);
    socket.emit("newMessage", { ...message, createdAt: new Date().getTime() });
  });
});

server.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
