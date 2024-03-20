import { useState } from 'react';
import { AxiosError } from 'axios';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { ApiError } from '@/typings';
import { Textarea } from './ui/textarea';
import { axiosInstance } from '@/lib/api';
import { useToast } from './ui/use-toast';
import { useAppDispatch } from '@/lib/hooks';
import { useMutation } from '@tanstack/react-query';
import { ToastAction } from '@radix-ui/react-toast';
import { MessagePayload, addMessage } from '@/lib/reducers/groups';

export default function SendMessage({ groupId }: { groupId: string }) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [text, setText] = useState<string>('');

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const { data } = await axiosInstance.post<{
        content: { data: MessagePayload };
      }>(`/group/${groupId}/message/create`, JSON.stringify({ text }));
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
    <>
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
    </>
  );
}
