import { useRef, useState, useEffect, createContext, type ReactNode, useCallback } from 'react';

type SockerProviderProps = {
  children: ReactNode;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (...args: any[]) => void;

type SocketContextType = {
  socket?: WebSocket | undefined;
  registerEvent: (eventName: string, listener: Listener) => void;
  removeEvent: (eventName: string) => boolean;
  sendMessage: (data: Record<string, unknown>) => void;
};

export const SocketContext = createContext<SocketContextType>({
  socket: undefined,
  registerEvent: () => {},
  removeEvent: () => false,
  sendMessage: () => {}
});

export function SocketProvider({ children }: SockerProviderProps) {
  const eventMap = useRef(new Map<string, Listener>());
  const [socket, setSocket] = useState<WebSocket | undefined>();
  const [messageQueue, setMessageQueue] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN || messageQueue.length === 0) return;
    for (const msg of messageQueue) {
      socket.send(JSON.stringify(msg));
    }
    setMessageQueue([]);
  }, [socket, messageQueue]);

  const sendMessage = useCallback(
    (data: Record<string, unknown>) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      } else {
        setMessageQueue(prevQueue => [...prevQueue, data]);
      }
    },
    [socket]
  );

  useEffect(() => {
    const socketHost = new URL(import.meta.env.VITE_SOCKET_HOST || 'http://localhost:3001/ws');
    const websocket = new WebSocket(
      `${socketHost.protocol === 'https:' ? 'wss:' : 'ws:'}//${socketHost.host}${socketHost.pathname}`
    );
    const openHandler = () => {
      setSocket(websocket);
    };

    const eventHandler = ({ data }: MessageEvent) => {
      try {
        // TODO: Finish type
        const json = JSON.parse(data) as {
          op: string;
          d: Record<string, unknown>;
        };
        const handler = eventMap.current.get(json.op);
        console.debug(json, handler);
        if (!handler) {
          console.debug('No event handler for event: %s', json.op);
          return;
        }
        handler(json.d);
      } catch {
        // TODO: Handle Invalid JSON
      }
    };
    websocket.addEventListener('open', openHandler);
    websocket.addEventListener('message', eventHandler);
    websocket.addEventListener('close', () => console.warn('Websocket has been terminated'));
    websocket.addEventListener('error', () => console.error('Error while connecting to websocket'));

    return () => {
      websocket.removeEventListener('message', eventHandler);
      websocket.removeEventListener('open', openHandler);
      websocket.close();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        sendMessage,
        registerEvent: (eventName: string, listener: Listener) => {
          eventMap.current.set(eventName, listener);
        },
        removeEvent: (eventName: string) => eventMap.current.delete(eventName)
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
