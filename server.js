const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 7887 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    for (let client of wss.clients) {
      try {
        client.send(message);
      }
      catch (err) {
        console.error(err);
      }
    }
  });
});