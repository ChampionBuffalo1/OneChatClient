import SocketEventHandler from './SocketEventHandler';
import { useRef, useState, useEffect, createContext, type ReactNode, useCallback } from 'react';

type SockerProviderProps = { children: ReactNode };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (data: any) => void;

type SocketContextType = {
  socket?: WebSocket | undefined;
  sendMessage: (data: Record<string, unknown>) => void;
  removeEvent: (eventName: SocketPayload['op']) => boolean;
  registerEvent: (eventName: SocketPayload['op'], listener: Listener) => void;
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
        const json = JSON.parse(data) as SocketPayload;
        const handler = eventMap.current.get(json.op);
        // TODO: Remove debug log once finished testing
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
        removeEvent: eventName => eventMap.current.delete(eventName),
        registerEvent: (eventName, listener) => eventMap.current.set(eventName, listener)
      }}
    >
      <SocketEventHandler />
      {children}
    </SocketContext.Provider>
  );
}

type SocketPayload = {
  op:
    | 'PERM_EDIT'
    | 'GROUP_EDIT'
    | 'GROUP_JOIN'
    | 'GROUP_LEAVE'
    | 'ICON_CHANGE'
    | 'GROUP_CREATE'
    | 'GROUP_DELETE'
    | 'MESSAGE_EDIT'
    | 'USER_METADATA'
    | 'INVALID_SCHEMA'
    | 'MESSAGE_CREATE'
    | 'MESSAGE_DELETE'
    | 'USER_AUTH_INIT'
    | 'USER_AUTH_FAILURE';
  d: {
    group: {
      id: string;
      name?: string;
      iconUrl?: string | null;
      description?: string | null;
    };
  };
};
