let socket: WebSocket | undefined;

const startWebsocket = <T extends Record<string, unknown>>(url: string, messageHandler: (message: T) => void): void => {
  if (socket) return;
  socket = new WebSocket(url);
  socket.addEventListener('message', event => {
    const jsonMessage = JSON.parse(event.data);
    messageHandler(jsonMessage);
  });
  socket.addEventListener('close', event => {
    console.log('Websocket connection closed with reason: ' + event.reason);
    socket = undefined;
  });
};

const sendMessage = (message: string): void => socket?.send(JSON.stringify(message));

const closeSocket = () => {
  socket?.close();
  socket = undefined;
};

export { startWebsocket, sendMessage, closeSocket };
