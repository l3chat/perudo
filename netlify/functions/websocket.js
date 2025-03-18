const { Server } = require('ws');

let server = null;
let connections = [];

exports.handler = async function (event, context) {
  if (!server) {
    server = new Server({ noServer: true });

    server.on('connection', (ws) => {
      connections.push(ws);
      console.log("Client connected!");

      ws.on('message', (message) => {
        connections.forEach(client => {
          if (client !== ws && client.readyState === 1) {
            client.send(message);
          }
        });
      });

      ws.on('close', () => {
        connections = connections.filter(conn => conn !== ws);
        console.log("Client disconnected!");
      });
    });
  }

  return {
    statusCode: 200,
    body: "WebSocket server ready"
  };
};
