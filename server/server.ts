import { server as WebSocketServer } from 'websocket';
import http  from 'http';

let snakes = [];

const httpServer = http.createServer((request, response) => {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
})

httpServer.listen(8080, () => {
  console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: false,
});

wsServer.on('request', request => {
  console.log('request detected!, trying to accept');
  const connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', (message) => {
    if (message.type === 'utf8' && message.utf8Data) {
      console.log('Received Message: ' + message.utf8Data);
      snakes = JSON.parse(message.utf8Data);
      console.log('got state from a wsClient!', snakes);
      wsServer.broadcast(JSON.stringify(snakes));
    }
  });

  connection.on('close', () => {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});
