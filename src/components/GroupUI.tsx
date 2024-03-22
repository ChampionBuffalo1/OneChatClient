import { useEffect } from 'react';
import MessageUI from './MessageUI';
import SendMessage from './SendMessage';
import GroupHeader from './GroupHeader';
import { axiosInstance } from '@/lib/api';
import { ScrollArea } from './ui/scroll-area';
import { setPermission } from '@/lib/reducers/permissions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

interface GroupProps {
  id: string;
  closeHandler: () => void;
}

export default function GroupUI({ id, closeHandler }: GroupProps) {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector(state => state.user.data.id);
  const group = useAppSelector(state => state.groups.value[id]);
  const messages = group?.messages || [];
  const userPermissions = useAppSelector(state => state.perms.value[id]) || 0;

  useEffect(() => {
    if (userPermissions === 0) {
      axiosInstance
        .post<{ content: { data: { id: string; permissions: number } } }>(`/group/${group.id}/member/permission`)
        .then(({ data }) => {
          dispatch(
            setPermission({
              id: group.id,
              permission: data.content.data.permissions
            })
          );
        });
    }
  }, [group.id, dispatch, userPermissions, currentUserId]);

  return (
    <div className="flex flex-col flex-1">
      <div className="top-0 flex justify-between rounded-md bg-gray-950">
        <GroupHeader id={group.id} permission={userPermissions} closeHandler={closeHandler} />
      </div>

      <div className="mx-2 flex-grow flex-row-reverse overflow-y-auto">
        <ScrollArea>
          {messages.map((msg, index) => (
            <MessageUI
              key={index}
              message={msg}
              groupId={group.id}
              userId={currentUserId}
              permission={userPermissions}
            />
          ))}
        </ScrollArea>
      </div>

      <div className="flex mb-2">
        <SendMessage groupId={group.id} />
      </div>
    </div>
  );
}
