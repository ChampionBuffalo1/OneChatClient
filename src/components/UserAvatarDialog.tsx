import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { ToastAction } from './ui/toast';
import { axiosInstance } from '@/lib/api';
import { useAppDispatch } from '@/lib/hooks';
import { useCallback, useState } from 'react';
import { updateAvatar } from '@/lib/reducers/user';
import { useMutation } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Dialog, DialogTitle, DialogHeader, DialogFooter, DialogContent } from './ui/dialog';

type IAvatarDialog = {
  avatarUrl?: string;
  dialogOpen: boolean;
  placeholder?: string;
  setDialogOpen: (value: boolean) => void;
};

export default function UserAvatarDialog({ avatarUrl, placeholder, dialogOpen, setDialogOpen }: IAvatarDialog) {
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | undefined>();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) return;
      const form = new FormData();
      form.append('avatar', file);

      const { data } = await axiosInstance.post('/user/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    onSuccess: data => {
      dispatch(updateAvatar(data.content.data.url));
      setDialogOpen(false);
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
              onClick={() => mutation.mutateAsync()}
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

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length === 1) {
      setFile(event.target.files[0]);
    }
  }, []);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={isOpen => {
        if (!isOpen) {
          setFile(undefined);
        }
        setDialogOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-primary-foreground">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <label htmlFor="avatarInput" className="cursor-pointer">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={file ? URL.createObjectURL(file) : avatarUrl}
                  className="group-hover:bg-gray-300 object-cover"
                />
                <AvatarFallback className="bg-[#d7a3ff] text-[#5f129b] text-lg group-hover:bg-gray-300">
                  {placeholder}
                </AvatarFallback>
              </Avatar>
              <input
                hidden
                type="file"
                accept="image/*"
                id="avatarInput"
                onChange={handleFileSelect}
                disabled={mutation.isPending}
              />
            </label>
          </div>

          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={mutation.isPending}
            className="mt-10 bg-zinc-700 border-gray-600 col-span-3 file:text-gray-300 file:border-slate-400 file:border-r-2 file:selection:text-red-500"
          />
        </div>

        <DialogFooter className="flex-row">
          <Button onClick={() => mutation.mutateAsync()} disabled={!file || mutation.isPending}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
