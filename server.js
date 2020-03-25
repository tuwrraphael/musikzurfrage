const fs = require('fs');
const minimist = require('minimist');
const WebSocket = require('ws');
const https = require('https');

let args = minimist(process.argv.slice(2), {
  default: {
    private: null,
    public: null
  }
});
let opts = {
  port: 7887
};

if (args.private && args.public) {
  console.log("using https");
  let privateKey = fs.readFileSync(args.private, 'utf8');
  let certificate = fs.readFileSync(args.public, 'utf8');
  let httpsServer = https.createServer({ key: privateKey, cert: certificate });
  httpsServer.listen(opts.port);
  opts = { server: httpsServer };
}

const wss = new WebSocket.Server(opts);

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