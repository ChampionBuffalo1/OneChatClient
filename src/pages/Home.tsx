import GroupUI from '@/components/GroupUI';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../lib/hooks';
import { setUser } from '@/lib/reducers/user';
import GroupSidebar from '@/components/GroupSideBar';
import InformativeBanner from '@/components/InformativeBanner';

export default function Home() {
  const [groupId, setGroupId] = useState<string>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    dispatch(setUser(user));
    // TODO: connect to websocket and handle events
  }, [dispatch]);

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
