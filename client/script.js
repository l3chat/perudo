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
//    .then(response => response.json())
.then(response => response.text()) 
.then(text => {
    try {
        return JSON.parse(text);
    } catch {
        console.error("Invalid JSON response:", text);
        return {};
    }
})
    .then(data => {
        roomId = data.roomId;
        document.getElementById("room-selection").style.display = "none";
        document.querySelector(".game-container").style.display = "flex";
        document.querySelector(".controls").style.display = "block";
        logMessage(`Вы создали комнату: ${roomId}`);
        startPolling();
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
    startPolling();
}

function sendMessage() {
    let input = document.getElementById("chat-input");
    if (input.value.trim() !== "") {
        fetch("/.netlify/functions/game", {
            method: "POST",
            body: JSON.stringify({ type: "message", roomId, player: playerName, text: input.value }),
            headers: { "Content-Type": "application/json" }
        });
        input.value = "";
    }
}

function startPolling() {
    function poll() {
        fetch(`/.netlify/functions/game?roomId=${roomId}`)
            .then(response => response.json())
	    .then(data => {
	        if (data && data.messages) {
    		    data.messages.forEach(msg => logMessage(`${msg.player}: ${msg.text}`));
		}
	        poll();
            })
            .catch(error => console.error("Polling error:", error));
    }
    poll();
}

window.onload = function() {
    logMessage("Добро пожаловать, " + playerName + "!");
};


function placeBet() {
    let count = document.getElementById("bet-count").value;
    let value = document.getElementById("bet-value").value;
    if (count && value) {
        fetch("/.netlify/functions/game", {
            method: "POST",
            body: JSON.stringify({ type: "bet", roomId, player: playerName, count, value }),
            headers: { "Content-Type": "application/json" }
        });
        logMessage(`${playerName} поставил ${count} костей номиналом ${value}`);
    }
}

function callPerudo() {
    fetch("/.netlify/functions/game", {
        method: "POST",
        body: JSON.stringify({ type: "perudo", roomId, player: playerName }),
        headers: { "Content-Type": "application/json" }
    });
    logMessage(`${playerName} вызвал Перудо!`);
}







