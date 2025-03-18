yylet games = {};  // Хранение активных игр

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
        return new Promise((resolve) => {
            const checkUpdates = () => {
                if (games[gameId].messages.length > 0 || games[gameId].bets.length > 0) {
                    let responseData = { messages: [...games[gameId].messages], bets: [...games[gameId].bets] };

                    // Очистка после отправки
                    games[gameId].messages = [];
                    games[gameId].bets = [];

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
