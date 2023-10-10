import { Send } from 'lucide-react';
import Message from '../components/Message';
import GroupHeader from '../components/GroupHeader';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { addMessage } from '../lib/reducers/groups';

export default function Group({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  // TODO: Complete this
  const mutation = useMutation({
    mutationFn: async (): Promise<Record<string, string>> => {
      return {};
    },
    onSuccess: ({ data }) => {
      dispatch(addMessage(data));
    }
  });

  const group = useAppSelector(state => state.groups.value.find(g => g.id == id))!;

  return (
    <div className="flex flex-col h-full">
      <GroupHeader title={group.name} />

      <div className="flex-grow overflow-auto mt-12">
        {/* TODO: Add pagination support once the oldest message has been read */}
        {group.messages.length === 0 ? (
          <p>Be the first one to start a conversation</p>
        ) : (
          group.messages.map(msg => <Message data={msg} key={msg.id} />)
        )}
      </div>

      <div className="flex ml-2 p-4">
        <input type="text" name="Message" id="message" className="w-full input outline-none" />
        <div
          className="flex items-center"
          onClick={() => {
            mutation.mutateAsync();
          }}
        >
          <Send className="mx-4 w-fit" size={28} />
        </div>
      </div>
    </div>
  );
}
