import { useState } from 'react';
import { Send } from 'lucide-react';
import { axiosInstance } from '../lib/api';
import Message from '../components/Message';
import GroupHeader from '../components/GroupHeader';
import { addMessage } from '../lib/reducers/groups';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../lib/hooks';

export default function Group({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const [messageState, setMessageState] = useState<string>('');

  // TODO: Complete this
  const mutation = useMutation({
    mutationFn: async (): Promise<Record<string, string>> => {
      const { data } = await axiosInstance.post(
        '/group/message',
        JSON.stringify({
          groupId: id,
          content: messageState
        })
      );
      return data;
    },
    onSuccess: ({ data }) => {
      
      dispatch(addMessage(data));
    },
    onError: error => {
      console.log(error);
    }
  });

  const group = useAppSelector(state => state.groups.value.find(g => g.id == id))!;

  return (
    <div className="flex flex-col h-full">
      <GroupHeader title={group.name} />

      <div className="flex-grow overflow-auto mt-12">
        {/* TODO: Add pagination support once the oldest message has been read */}
        {group.messages.length === 0 ? (
          <p className="text-3xl pt-2 ml-2">Be the first one to start a conversation</p>
        ) : (
          group.messages.map(msg => <Message data={msg} key={msg.id} />)
        )}
      </div>

      <div className="flex ml-2 p-4">
        <input
          type="text"
          name="Message"
          id="message"
          value={messageState}
          className="w-full input outline-none"
          onChange={e => {
            setMessageState(e.target.value);
          }}
        />
        <button
          className="flex items-center disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => {
            mutation.mutateAsync();
          }}
          disabled={!messageState || mutation.isLoading}
        >
          <Send className="mx-4 w-fit" size={28} />
        </button>
      </div>
    </div>
  );
}
