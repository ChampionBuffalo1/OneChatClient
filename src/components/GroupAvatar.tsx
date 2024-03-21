import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { ToastAction } from './ui/toast';
import { axiosInstance } from '@/lib/api';
import { useAppSelector } from '@/lib/hooks';
import { useCallback, useState } from 'react';
import { cn, checkPermission } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Dialog, DialogTitle, DialogHeader, DialogFooter, DialogContent, DialogTrigger } from './ui/dialog';

export default function GroupAvatar({ id, permission }: { id: string; permission: number }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const group = useAppSelector(state => state.groups.value[id]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file || !checkPermission(permission, 'MANAGE_GROUP')) return;
      const form = new FormData();
      form.append('icon', file);
      const { data } = await axiosInstance.post(`/group/${id}/icon`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    onSuccess: () => setDialogOpen(false),
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
  const isDisabled = !checkPermission(permission, 'MANAGE_GROUP') || mutation.isPending;
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
      <DialogTrigger>
        <Avatar>
          <AvatarImage src={group.iconUrl} />
          <AvatarFallback className="bg-[#d7a3ff] text-[#5f129b] text-lg">
            {group.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-primary-foreground">
        <DialogHeader>
          <DialogTitle>Change Group Icon</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <label htmlFor="iconInput" className={cn('cursor-pointer', isDisabled && 'cursor-not-allowed')}>
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={file ? URL.createObjectURL(file) : group.iconUrl}
                  className="group-hover:bg-gray-300 object-cover"
                />
                <AvatarFallback className="bg-[#d7a3ff] text-[#5f129b] text-lg group-hover:bg-gray-300">
                  {group.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <input
                hidden
                type="file"
                id="iconInput"
                accept="image/*"
                className="group  disabled:cursor-not-allowed"
                onChange={handleFileSelect}
                disabled={isDisabled}
              />
            </label>
          </div>

          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isDisabled}
            className="mt-10 bg-zinc-700 border-gray-600 col-span-3 file:text-gray-300 file:border-slate-400 file:border-r-2 file:selection:text-red-500 disabled:cursor-not-allowed cursor-pointer"
          />
          {!checkPermission(permission, 'MANAGE_GROUP') && (
            <Label className="mt-2 bg- p-2 rounded-md text-xs">
              You don&apos;t have permission to change group icon
            </Label>
          )}
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
