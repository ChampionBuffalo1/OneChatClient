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
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { updateUsername } from '@/lib/reducers/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
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
  username: z.string().min(1, 'Username must be at least 1 character.').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters.').optional()
});

export default function UserSettingsDialog() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const user = useAppSelector(state => state.user.data);

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
      const { data } = await axiosInstance.patch<ApiResponse>('/user/', JSON.stringify(sendObj));
      return data;
    },
    onSuccess: data => {
      if (!data) return;
      const old = JSON.parse(localStorage.getItem('user') || '');
      localStorage.setItem('user', JSON.stringify({ ...old, username: data.content.data.username }));
      dispatch(updateUsername(data.content.data.username));
    },
    onError: (error: AxiosError<ApiError<'username'>>, variables) => {
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
      for (const eor of error.response?.data.errors) {
        if (eor.param === 'username') {
          form.setError('username', { message: eor.message });
        }
      }
    }
  });

  const deletation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete('/user/');
      return data;
    },
    onSuccess: () => {
      localStorage.clear();
      navigate(0);
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
      password: '',
      username: ''
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
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="username"
                      placeholder={user.username}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="********"
                      disabled={mutation.isPending}
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
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-800 text-primary-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-white">
                  Are you sure you want to delete your account? This action is permanent and cannot be undone
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-black hover:bg-slate-300">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-slate-500" onClick={() => deletation.mutateAsync()}>
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
      username: string;
      createdAt: Date;
    };
  };
};
