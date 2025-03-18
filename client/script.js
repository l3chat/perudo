let playerName = prompt("Введите ваше имя") || "Игрок";

function logMessage(message) {
    let chatBox = document.getElementById("chat-box");
    let newMessage = document.createElement("p");
    newMessage.textContent = message;
    chatBox.appendChild(newMessage);
}

function placeBet() {
    let count = document.getElementById("bet-count").value;
    let value = document.getElementById("bet-value").value;
    if (count && value) {
        fetch("/.netlify/functions/game", {
            method: "POST",
            body: JSON.stringify({ type: "bet", player: playerName, count, value }),
            headers: { "Content-Type": "application/json" }
        });
        logMessage(`${playerName} поставил ${count} костей номиналом ${value}`);
    }
}

function callPerudo() {
    fetch("/.netlify/functions/game", {
        method: "POST",
        body: JSON.stringify({ type: "perudo", player: playerName }),
        headers: { "Content-Type": "application/json" }
    });
    logMessage(`${playerName} вызвал Перудо!`);
}

function sendMessage() {
    let input = document.getElementById("chat-input");
    if (input.value.trim() !== "") {
        fetch("/.netlify/functions/game", {
            method: "POST",
            body: JSON.stringify({ type: "message", player: playerName, text: input.value }),
            headers: { "Content-Type": "application/json" }
        });
        logMessage(`${playerName}: ${input.value}`);
        input.value = "";
    }
}

function startPolling() {
    function poll() {
        fetch("/.netlify/functions/game")
            .then(response => response.json())
            .then(data => {
                data.messages.forEach(msg => logMessage(`${msg.player}: ${msg.text}`));
                poll(); 
            })
            .catch(error => console.error("Polling error:", error));
    }
    poll(); 
}

window.onload = function() {
    logMessage("Добро пожаловать, " + playerName + "!");
    startPolling();
};
