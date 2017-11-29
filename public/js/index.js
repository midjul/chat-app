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

let locationButton = document.getElementById("send-location");

locationButton.addEventListener("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      alert("Unable to fetch location.");
    }
  );
});

socket.on("newLocationMessage", function(message) {
  let li = document.createElement("li");
  let a = document.createElement("a");
  a.textContent = `${message.from}: My current location`;
  a.setAttribute("target", "_blank");
  a.setAttribute("href", message.url);
  li.appendChild(a);
  document.getElementById("messages").appendChild(li);
});
