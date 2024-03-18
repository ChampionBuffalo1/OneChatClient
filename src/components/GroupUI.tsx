import { useState } from 'react';
import { AxiosError } from 'axios';
import MessageUI from './MessageUI';
import { Button } from './ui/button';
import { ApiError } from '@/typings';
import { ToastAction } from './ui/toast';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { axiosInstance } from '@/lib/api';
import { ScrollArea } from './ui/scroll-area';
import { useMutation } from '@tanstack/react-query';
import { Users, Settings, Send } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { MessagePayload, addMessage } from '@/lib/reducers/groups';

interface GroupProps {
  id: string;
}

export default function GroupUI({ id }: GroupProps) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [text, setText] = useState<string>('');
  const currentUserId = useAppSelector(state => state.user.data.id);
  const group = useAppSelector(state => state.groups.value.find(grp => grp.id === id));
  const messages = group?.messages || [];

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      if (!group?.id) return;
      const { data } = await axiosInstance.post<{
        content: { data: MessagePayload };
      }>(`/group/${group.id}/message/create`, JSON.stringify({ text }));
      return data.content.data;
    },
    onSuccess: data => {
      if (data) {
        dispatch(addMessage(data));
        setText('');
      }
    },
    onError: (error: AxiosError<ApiError>, parameters) => {
      if (error.message === 'Network Error') {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: (
            <ToastAction
              altText="Try again"
              onClick={() => mutation.mutateAsync(parameters)}
              className="rounded-lg hover:bg-red-400 border border-gray-200 p-2"
            >
              Try again
            </ToastAction>
          )
        });
        return;
      }
      const err = error.response?.data.errors[0];
      if (err?.code === 'INVALID_PERMISSION') {
        toast({
          title: 'Permission Denied',
          description: "You don't have the permissions required to send message"
        });
      }
    }
  });

  return (
    <div className="flex flex-col flex-1">
      <div className="top-0 flex justify-between rounded-md bg-gray-950">
        <h2 className="text-xl ml-2 p-2 flex gap-2">{group?.name}</h2>
        <div className="flex items-center mx-2">
          <Users className="mx-6" />
          <Settings className="mr-4" />
        </div>
      </div>

      <div className="mx-2 flex-grow flex-row-reverse overflow-y-auto">
        <ScrollArea>
          {messages.map((msg, index) => (
            <MessageUI key={index} message={msg} userId={currentUserId} groupId={group!.id} />
          ))}
        </ScrollArea>
      </div>

      <div className="flex mb-2">
        <Textarea
          value={text}
          onChange={el => setText(el.target.value)}
          className="bg-gray-600 border border-primary focus:border-blue-600 text-white mx-2 w-[95%] h-8 resize-none overflow-y-auto"
        />
        <div className="flex flex-col justify-center">
          <Button
            variant="secondary"
            className="rounded-lg mr-2 flex justify-between text-primary text-sm"
            disabled={mutation.isPending || !text}
            onClick={() => mutation.mutateAsync(text)}
          >
            Send
            <Send size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
