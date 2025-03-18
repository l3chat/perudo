const games = {};  // Хранение игровых комнат
const ROOM_TIMEOUT = 600000; // 10 минут до удаления пустых комнат

function cleanRooms() {
    const now = Date.now();
    for (let roomId in games) {
        if (now - games[roomId].lastActivity > ROOM_TIMEOUT) {
            delete games[roomId];
        }
    }
}

// Функция для создания новой комнаты
function createRoom() {
    let roomId = Math.random().toString(36).substr(2, 6); // Генерируем 6-значный код
    games[roomId] = { players: [], bets: [], messages: [], lastActivity: Date.now() };
    return roomId;
}

exports.handler = async function (event, context) {
    cleanRooms();

    if (event.httpMethod === "POST") {
        let data = JSON.parse(event.body);

        if (data.type === "createRoom") {
            let newRoomId = createRoom();
            return { statusCode: 200, body: JSON.stringify({ roomId: newRoomId }) };
        }

        let roomId = data.roomId;
        if (!games[roomId]) return { statusCode: 404, body: "Room not found" };

        games[roomId].lastActivity = Date.now();

        if (data.type === "join") {
            if (!games[roomId].players.includes(data.player)) {
                games[roomId].players.push(data.player);
            }
        } else if (data.type === "bet") {
            games[roomId].bets.push({ player: data.player, count: data.count, value: data.value });
        } else if (data.type === "message") {
            games[roomId].messages.push({ player: data.player, text: data.text });
        } else if (data.type === "perudo") {
            games[roomId].messages.push({ player: data.player, text: "Перудо! Проверяем ставку..." });
        }

        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    if (event.httpMethod === "GET") {
        let roomId = event.queryStringParameters.roomId;
        if (!games[roomId]) return { statusCode: 404, body: "Room not found" };

        return new Promise((resolve) => {
            const checkUpdates = () => {
                if (games[roomId].messages.length > 0 || games[roomId].bets.length > 0) {
                    let responseData = { messages: [...games[roomId].messages], bets: [...games[roomId].bets] };

                    // Очистка сообщений после отправки
                    games[roomId].messages = [];
                    games[roomId].bets = [];

                    resolve({
                        statusCode: 200,
                        body: JSON.stringify(responseData)
                    });
                } else {
                    setTimeout(checkUpdates, 2000);
                }
            };
            checkUpdates();
        });
    }

    return { statusCode: 400, body: "Invalid request" };
};





















































































































































































































