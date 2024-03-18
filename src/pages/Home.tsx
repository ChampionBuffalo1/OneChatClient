import { useEffect, useState } from 'react';
import GroupUI from '@/components/GroupUI';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch } from '../lib/hooks';
import { setUser } from '@/lib/reducers/user';
import GroupSidebar from '@/components/GroupSideBar';
import InformativeBanner from '@/components/InformativeBanner';

export default function Home() {
  const dispatch = useAppDispatch();
  const [groupId, setGroupId] = useState<string>('');

  useEffect(() => {
    if (!dispatch) return;
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const user = JSON.parse(userInfo || '{}');
      dispatch(setUser(user));
    }
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
