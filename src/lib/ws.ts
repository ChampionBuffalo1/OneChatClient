class WebSocketUtil {
  private static dispatch: boolean = false;

  static instance: WebSocket;
  static getInstance(): WebSocket {
    if (!WebSocketUtil.instance) {
      WebSocketUtil.instance = new WebSocket('ws://localhost:3001/ws');
    }
    return WebSocketUtil.instance;
  }
  static send(value: Record<string, unknown>): void {
    if (WebSocketUtil.dispatch) {
      WebSocketUtil.getInstance().send(JSON.stringify(value));
    }
  }
  static registerListener = (listener: (event: MessageEvent) => void, token: string): void => {
    if (!WebSocketUtil.dispatch) {
      WebSocketUtil.getInstance().addEventListener('open', () => {
        WebSocketUtil.send({
          token
        });
      });

      WebSocketUtil.getInstance().addEventListener('message', listener);

      WebSocketUtil.getInstance().addEventListener('close', event => {
        console.log('WebSocketUtil connection closed with reason: ' + event.reason);
      });
      WebSocketUtil.dispatch = true;
    }
  };
  static close(): void {
    if (WebSocketUtil.dispatch) WebSocketUtil.instance.close();
  }
}

export default WebSocketUtil;
