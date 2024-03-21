import { z } from 'zod';
import { AxiosError } from 'axios';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ApiError } from '@/typings';
import { Settings } from 'lucide-react';
import { ToastAction } from './ui/toast';
import { useToast } from './ui/use-toast';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '@/lib/api';
import { useAppSelector } from '@/lib/hooks';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormItem, FormLabel, FormControl, FormField, FormMessage } from './ui/form';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription
} from './ui/alert-dialog';

const formSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional()
});

export default function GroupSettings({ id }: { id: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const group = useAppSelector(state => state.groups.value[id]);

  const mutation = useMutation({
    mutationFn: async (newValues: formSchema) => {
      const atleastOneValue = Object.values(newValues).some(value => value !== '');
      if (!atleastOneValue) return;

      const sendObj: Record<string, string> = {};
      for (const [k, v] of Object.entries(newValues)) {
        if (v) {
          sendObj[k as keyof formSchema] = v;
        }
      }
      const { data } = await axiosInstance.patch<ApiResponse>(`/group/${id}/edit`, JSON.stringify(sendObj));
      return data.content.data;
    },
    onError: (error: AxiosError<ApiError<keyof formSchema>>, variables) => {
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
      for (const eor of error.response.data.errors) {
        form.setError(eor.param, { message: eor.message });
      }
    }
  });

  const deletation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete(`/group/${id}/delete`);
      return data;
    },
    onError: error => {
      if (error.message === 'Network Error') {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: (
            <ToastAction
              altText="Try again"
              onClick={() => deletation.mutateAsync()}
              className="rounded-lg hover:bg-red-400  border border-gray-200 p-2"
            >
              Try again
            </ToastAction>
          )
        });
        return;
      }
    }
  });

  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const handleSubmit = useCallback(async () => {
    const valid = await form.trigger();
    if (valid) {
      mutation.mutateAsync(form.getValues()).then(() => {
        form.reset();
        setOpen(false);
      });
    }
  }, [form, mutation]);

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) {
          // `reset` the form on dialog close
          form.reset();
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="link" className="hover:bg-gray-600 text-primary-foreground">
          <Settings className="mx-2" /> Settings
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-primary-foreground">
        <DialogHeader>
          <DialogTitle>Edit group</DialogTitle>
          <DialogDescription className="text-gray-400">
            Make changes to your group here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder={group.name}
                      className="bg-zinc-700 border-gray-600 col-span-3"
                      disabled={mutation.isPending}
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="description"
                      type="text"
                      disabled={mutation.isPending}
                      placeholder={group.description}
                      className="bg-zinc-700 border-gray-600 col-span-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="flex-row">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={deletation.isPending} variant="destructive">
                Delete Group
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-800 text-primary-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-white">
                  Are you sure you want to delete this group? This action is permanent and cannot be undone
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-black hover:bg-slate-300">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-slate-600" onClick={() => deletation.mutateAsync()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex-grow" />
          <Button disabled={mutation.isPending} onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
type formSchema = z.infer<typeof formSchema>;
type ApiResponse = {
  content: {
    data: {
      id: string;
      name: string;
      description: string;
      iconUrl?: string;
    };
  };
};
