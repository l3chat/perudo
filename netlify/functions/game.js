let games = {};  // Хранение активных игр

exports.handler = async function (event, context) {
    let gameId = "default";  // Пока используем одну игру без комнат

    if (!games[gameId]) {
        games[gameId] = { bets: [], messages: [] };
    }

    if (event.httpMethod === "POST") {
        let data = JSON.parse(event.body);

        if (data.type === "bet") {
            games[gameId].bets.push({ player: data.player, count: data.count, value: data.value });
        } else if (data.type === "message") {
            games[gameId].messages.push({ player: data.player, text: data.text });
        } else if (data.type === "perudo") {
            games[gameId].messages.push({ player: data.player, text: "Перудо! Проверяем ставку..." });
        }

        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    if (event.httpMethod === "GET") {
        return { statusCode: 200, body: JSON.stringify(games[gameId]) };
    }

    return { statusCode: 400, body: "Invalid request" };
};
