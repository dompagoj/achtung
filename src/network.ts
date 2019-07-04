import { w3cwebsocket as W3CWebSocket } from 'websocket';

const client = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');

client.onerror = function() {
  console.log('Connection Error');
};

client.onopen = function() {
  console.log('WebSocket Client Connected');
};

client.onclose = function() {
  console.log('echo-protocol Client Closed');
};

client.onmessage = function(e) {
  if (typeof e.data === 'string') {
    _handler(e.data);
  }
};

export function sendMessage(message: string) {
  if (client.readyState !== client.OPEN) {
    return
  }
  client.send(message);
}

let _handler = (data: string) => {};
export function setMessageHandler(handler) {
  _handler = handler;
}
