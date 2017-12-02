const socket = io();
const form = document.getElementById("message-form");

function scrollToBottom() {
  let messages = document.querySelector("#messages");
  let newMessage = messages.querySelector("li:last-child");
  let clientHeight = messages.clientHeight;
  let scrollTop = messages.scrollTop;
  let scrollHeight = messages.scrollHeight;
  let newMessageHeight = newMessage.clientHeight;
  let lastMessageHeight = newMessage.previousSibling || newMessage;

  if (
    clientHeight +
      scrollTop +
      newMessageHeight +
      lastMessageHeight.clientHeight >=
    scrollHeight
  ) {
    console.log("should scroll");
    messages.scrollTop = scrollHeight;
  }
}

socket.on("connect", function() {
  let params = parseQuery(window.location.search);
  socket.emit("join", params, function(err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });
});

socket.on("newMessage", message => {
  let formattedTime = moment(message.createdAt).format("h:mm a");
  let template = document.querySelector("#message-template").textContent;

  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  let li = document.createElement("li");
  li.innerHTML = html;
  li.classList.add("message");
  document.getElementById("messages").appendChild(li);
  scrollToBottom();
});

form.addEventListener("submit", function(e) {
  e.preventDefault();

  let messageTextbox = this.querySelector("[name=message]");
  if (!messageTextbox.value) return messageTextbox.focus();
  socket.emit(
    "createMessage",
    {
      text: messageTextbox.value
    },
    function() {
      messageTextbox.value = "";
    }
  );
});

let locationButton = document.getElementById("send-location");

locationButton.addEventListener("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser");
  }
  locationButton.textContent = "Sending location...";
  locationButton.disabled = true;
  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit(
        "createLocationMessage",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        function() {
          locationButton.textContent = "Send location";
          locationButton.disabled = false;
        }
      );
    },
    function() {
      alert("Unable to fetch location.");
    }
  );
});

socket.on("newLocationMessage", function(message) {
  let formattedTime = moment(message.createdAt).format("h:mm a");
  let template = document.querySelector("#location-message-template")
    .textContent;
  let li = document.createElement("li");
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    url: message.url
  });
  li.innerHTML = html;
  li.classList.add("message");
  document.getElementById("messages").appendChild(li);
  scrollToBottom();
});

socket.on("updateUserList", function(users) {
  let ol = `<ol>
    ${users.map(function(user) {
      return `<li>${user}</li>`;
    })} 
  </ol>`;
  document.getElementById("users").innerHTML = ol.replace(/\,/g, "");
});
