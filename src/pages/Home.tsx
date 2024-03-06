import GroupUI from '@/components/GroupUI';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch } from '../lib/hooks';
import { setUser } from '@/lib/reducers/user';
import { useNavigate } from 'react-router-dom';
import GroupSidebar from '@/components/GroupSideBar';
import { useToast } from '@/components/ui/use-toast';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '@/components/socket-provider';
import InformativeBanner from '@/components/InformativeBanner';

export default function Home() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);
  const [groupId, setGroupId] = useState<string>('');

  useEffect(() => {
    if (!dispatch || !socket) return;
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const user = JSON.parse(userInfo || '{}');
      dispatch(setUser(user));
    }
    const token = localStorage.getItem('token');
    if (token) {
      socket.registerEvent('USER_AUTH_INIT', () => {
        socket.sendMessage({ token: 'oki' });
        socket.registerEvent('USER_META_DATA', (data: Record<string, unknown>) => {
          // TODO: Finish this
          console.debug('We got the metadata:', data);
        });
        socket.registerEvent('USER_AUTH_FAILURE', () => {
          toast({
            variant: 'default',
            title: 'Invalid Token',
            description: 'Your token has expired. Please login again'
          });
          setTimeout(() => {
            localStorage.clear();
            navigate(0);
          }, 1000 * 5); // 5s delay
        });
      });
    }
  }, [toast, socket, navigate, dispatch]);

  return (
    <>
      <Helmet>
        <title>OneChat</title>
      </Helmet>
      <div className="flex flex-row h-[100vh] w-full bg-primary text-primary-foreground overflow-hidden">
        <GroupSidebar selectHandler={setGroupId} />
        {groupId && <GroupUI id={groupId} />}
        {!groupId && <InformativeBanner />}
      </div>
    </>
  );
}
