const socket = io();
const form = document.getElementById("message-form");

socket.on("newMessage", message => {
  let li = document.createElement("li");
  li.textContent = `${message.from}: ${message.text}`;
  document.getElementById("messages").appendChild(li);
});

form.addEventListener("submit", function(e) {
  e.preventDefault();

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: this.querySelector("input").value
    },
    function() {}
  );
});
