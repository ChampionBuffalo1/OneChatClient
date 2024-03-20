import { z } from 'zod';
import { AxiosError } from 'axios';
import { Input } from './ui/input';
import { useCallback } from 'react';
import { Button } from './ui/button';
import { ApiError } from '@/typings';
import { toast } from './ui/use-toast';
import { Textarea } from './ui/textarea';
import { ToastAction } from './ui/toast';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '@/lib/api';
import { useAppDispatch } from '@/lib/hooks';
import { addGroup } from '@/lib/reducers/groups';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

type IActionDialog = {
  open: boolean;
  status: 'join' | 'create';
  setOpen: (val: boolean) => void;
};

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

export default function GroupActionDialog({ open, setOpen, status }: IActionDialog) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' }
  });
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: async (value: z.infer<typeof schema>) => {
      const isJoin = status === 'join';
      const json: Record<string, string> = { name: value.name };
      if (value.description) json['description'] = value.description;

      const { data } = await axiosInstance.post<ApiResponse>(
        isJoin ? `/invite/${value.name}/join/` : '/group/create',
        JSON.stringify(json)
      );
      return data;
    },
    onSuccess: data => {
      // @ts-expect-error: Need to fix the type error
      dispatch(addGroup(status === 'join' ? data.content.data.group : data.content.data));
      setOpen(false);
    },
    onError: (error: AxiosError<ApiError>, variables) => {
      if (error.message === 'Network Error') {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: (
            <ToastAction
              altText="Try again"
              onClick={() => mutation.mutateAsync(variables)}
              className="rounded-lg hover:bg-red-400 border border-gray-200 p-2"
            >
              Try again
            </ToastAction>
          )
        });
        return;
      }

      if (!error.response) return;
      for (const err of error.response.data.errors) {
        if (err.param === 'name') {
          form.setError('name', { message: err.message });
        }
        if (err.code === 'UNAUTHORIZED') {
          toast({
            variant: 'destructive',
            title: 'Improper use of invite',
            description: err.message
          });
        }
      }
    }
  });

  const handleClick = useCallback(async () => {
    const valid = await form.trigger();
    if (!valid) return;
    mutation.mutateAsync(form.getValues());
  }, [form, mutation]);

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) {
          form.reset();
        }
        setOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[425px] hover:border-blue-400 bg-slate-800 text-primary-foreground">
        <DialogHeader>
          <DialogTitle>{status === 'join' ? 'Join ' : 'Create '}Group</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          {status === 'join' ? (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invite Id</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                      placeholder="Enter group invite Id"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                        placeholder="Enter group name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Enter group description"
                        className="h-10 resize-none bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </Form>

        <DialogFooter className="flex-row">
          <Button onClick={handleClick} disabled={mutation.isPending} variant="secondary">
            {status === 'join' ? 'Join' : 'Create'} Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type groupData = {
  id: string;
  name: string;
  iconUrl?: string;
  description: string;
  owner?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
};
type ApiResponse = {
  content: {
    data:
      | groupData
      | {
          group: groupData;
        };
  };
};
