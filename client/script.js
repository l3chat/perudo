let players = ["Игрок 1", "Игрок 2", "Игрок 3"];
let chatBox = document.getElementById("chat-box");

function logMessage(message) {
    let newMessage = document.createElement("p");
    newMessage.textContent = message;
    chatBox.appendChild(newMessage);
}

function updatePlayers() {
    let playerList = document.getElementById("player-list");
    playerList.innerHTML = "";
    players.forEach(player => {
        let li = document.createElement("li");
        li.textContent = player;
        playerList.appendChild(li);
    });
}

function rollDice() {
    let diceContainer = document.getElementById("dice-container");
    diceContainer.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        let diceValue = Math.floor(Math.random() * 6) + 1;
        let dice = document.createElement("div");
        dice.classList.add("dice");
        dice.textContent = diceValue;
        diceContainer.appendChild(dice);
    }
}

function sendMessage() {
    let input = document.getElementById("chat-input");
    if (input.value.trim() !== "") {
        logMessage("Вы: " + input.value);
        input.value = "";
    }
}

function placeBet() {
    let count = document.getElementById("bet-count").value;
    let value = document.getElementById("bet-value").value;
    if (count && value) {
        logMessage(`Ставка: ${count} костей номиналом ${value}`);
    }
}

function callPerudo() {
    logMessage("Перудо! Проверяем ставку...");
}

window.onload = function() {
    updatePlayers();
    rollDice();
};
