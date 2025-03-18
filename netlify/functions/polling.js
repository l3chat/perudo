let messages = [];

exports.handler = async function (event, context) {
  if (event.httpMethod === "POST") {
    // Клиент отправляет сообщение
    const data = JSON.parse(event.body);
    messages.push(data.message);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }

  if (event.httpMethod === "GET") {
    // Клиент ожидает новые сообщения (Long Polling)
    return new Promise((resolve) => {
      const checkMessages = () => {
        if (messages.length > 0) {
          resolve({
            statusCode: 200,
            body: JSON.stringify({ messages })
          });
          messages = []; // Очищаем очередь
        } else {
          setTimeout(checkMessages, 2000); // Проверяем снова через 2 секунды
        }
      };
      checkMessages();
    });
  }

  return { statusCode: 400, body: "Invalid request" };
};
