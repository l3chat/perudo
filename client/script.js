let playerName = prompt("Введите ваше имя") || "Игрок";
let roomId = null;

function logMessage(message) {
    let chatBox = document.getElementById("chat-box");
    let newMessage = document.createElement("p");
    newMessage.textContent = message;
    chatBox.appendChild(newMessage);
}

function createRoom() {
    fetch("/.netlify/functions/game", {
        method: "POST",
        body: JSON.stringify({ type: "createRoom" }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        roomId = data.roomId;
        document.getElementById("room-selection").style.display = "none";
        document.querySelector(".game-container").style.display = "flex";
        document.querySelector(".controls").style.display = "block";
        logMessage(`Вы создали комнату: ${roomId}`);
    });
}

function joinRoom() {
    let inputRoomId = document.getElementById("room-id-input").value;
    if (!inputRoomId) return alert("Введите ID комнаты!");

    roomId = inputRoomId;
    fetch("/.netlify/functions/game", {
        method: "POST",
        body: JSON.stringify({ type: "join", roomId, player: playerName }),
        headers: { "Content-Type": "application/json" }
    });

    document.getElementById("room-selection").style.display = "none";
    document.querySelector(".game-container").style.display = "flex";
    document.querySelector(".controls").style.display = "block";
    logMessage(`Вы вошли в комнату: ${roomId}`);
}

window.onload = function() {
    logMessage("Добро пожаловать, " + playerName + "!");
};
