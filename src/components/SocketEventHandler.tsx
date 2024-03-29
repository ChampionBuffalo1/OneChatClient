import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useContext, useCallback } from 'react';
import { setPermission } from '@/lib/reducers/permissions';
import { SocketContext } from '@/components/socket-provider';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import {
  addGroup,
  addMessage,
  changeIcon,
  updateGroup,
  removeGroup,
  updateMessage,
  removeMessage,
  MessagePayload,
  MessageType
} from '@/lib/reducers/groups';

export default function SocketEventHandler() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);
  const currentUserId = useAppSelector(state => state.user.data).id;

  const handleInvalidAuth = useCallback(() => {
    toast({
      title: 'Invalid Token',
      description: 'Your token has expired. Please login again'
    });
    setTimeout(() => {
      localStorage.clear();
      navigate(0);
    }, 1000 * 5); // 5s delay
  }, [toast, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Socket Events
      socket.registerEvent('USER_AUTH_INIT', () => socket.sendMessage({ token }));
      socket.registerEvent('USER_METADATA', data => dispatch(addGroup(data)));
      socket.registerEvent('USER_AUTH_FAILURE', handleInvalidAuth);

      // Group Events
      socket.registerEvent('ICON_CHANGE', (data: { url: string; group: { id: string } }) => {
        dispatch(changeIcon({ url: data.url, id: data.group.id }));
      });

      socket.registerEvent(
        'GROUP_JOIN',
        (data: {
          group: {
            id: string;
            name: string;
            iconUrl?: string;
            description?: string;
            messages: MessageType[]
          };
        }) => {
          dispatch(addGroup(data.group));
        }
      );

      socket.registerEvent(
        'GROUP_CREATE',
        (data: {
          group: {
            id: string;
            name: string;
            iconUrl?: string;
            description?: string;
          };
        }) => {
          dispatch(addGroup({ messages: [], ...data.group }));
        }
      );

      socket.registerEvent(
        'GROUP_EDIT',
        (data: { group: { id: string; name: string; description: string; iconUrl?: string } }) => {
          dispatch(updateGroup(data.group));
        }
      );

      socket.registerEvent('PERM_EDIT', (data: { group: { id: string }; userId: string; permissions: number }) => {
        dispatch(
          setPermission({
            id: data.group.id,
            permission: data.permissions
          })
        );
      });

      socket.registerEvent('GROUP_DELETE', (data: { group: { id: string; name: string } }) => {
        dispatch(removeGroup(data.group.id));
      });
      socket.registerEvent('MESSAGE_EDIT', (data: MessagePayload) => {
        dispatch(updateMessage(data));
      });
      socket.registerEvent('MESSAGE_CREATE', (data: MessagePayload) => {
        dispatch(addMessage(data));
      });
      socket.registerEvent('MESSAGE_DELETE', (data: MessagePayload) => {
        console.log(data);
        dispatch(removeMessage(data));
      });
    }
  }, [socket, dispatch, currentUserId, handleInvalidAuth]);

  return <></>;
}
