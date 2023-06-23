let socket: WebSocket | null = null;

const startWebsocket = (url: string, messageHandler: Function): void => {
  if (socket) return;
  socket = new WebSocket(url);
  socket.onmessage = event => {
    const jsonMessage = JSON.parse(event.data);
    messageHandler(jsonMessage);
  };
  socket.onclose = event => {
    console.log('Websocket connection closed with reason: ', event);
    socket = null;
  };
};

const sendMessage = (message: string): void => socket?.send(JSON.stringify(message));

const closeSocket = () => {
  socket?.close();
  socket = null;
};

export { startWebsocket, sendMessage, closeSocket };
