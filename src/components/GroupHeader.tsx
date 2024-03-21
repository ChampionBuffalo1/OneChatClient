import { useState } from 'react';
import { AxiosError } from 'axios';
import { Button } from './ui/button';
import { ApiError } from '@/typings';
import LeaveGroup from './LeaveGroup';
import { ToastAction } from './ui/toast';
import { axiosInstance } from '@/lib/api';
import { useToast } from './ui/use-toast';
import { Separator } from './ui/separator';
import GroupSettings from './GroupSettings';
import { useAppSelector } from '@/lib/hooks';
import { checkPermission } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription
} from './ui/alert-dialog';
import GroupAvatar from './GroupAvatar';

export default function GroupHeader({ id, permission }: { permission: number; id: string }) {
  const { toast } = useToast();
  const [invite, setInvite] = useState(false);
  const group = useAppSelector(state => state.groups.value[id]);

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!checkPermission(permission, 'INVITE_MEMBER')) return;
      const { data } = await axiosInstance.post(
        '/invite',
        JSON.stringify({
          groupId: id,
          limit: 1
        })
      );
      return data.content.data;
    },
    onSuccess: (data: { token: string; limit: number; expiresAt?: string; createdAt: string }) => {
      navigator.clipboard.writeText(data.token);
      setInvite(true);
      toast({
        title: 'Invite Link Copied',
        description: 'Share this link to invite your friends over!',
        duration: 1500 // 1.5s
      });
      setTimeout(() => setInvite(false), 1000 * 3);
    },
    onError: (error: AxiosError<ApiError>) => {
      if (error.message === 'Network Error') {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: (
            <ToastAction
              altText="Try again"
              onClick={() => inviteMutation.mutateAsync()}
              className="rounded-lg hover:bg-red-400 border border-gray-200 p-2"
            >
              Try again
            </ToastAction>
          )
        });
        return;
      }
      const err = error.response?.data.errors[0];
      if (err?.code === 'ACTION_NOT_ALLOWED') {
        toast({
          title: 'Unsufficient permissions',
          description: err.message
        });
      }
    }
  });

  return (
    <>
      <div className="flex p-2 ml-2">
        <GroupAvatar id={group.id} permission={permission} />

        <AlertDialog>
          {!group.description && <h2 className="ml-2 text-xl">{group.name}</h2>}

          {group.description && (
            <AlertDialogTrigger>
              <h2 className="ml-2 text-xl">{group.name}</h2>
            </AlertDialogTrigger>
          )}
          <AlertDialogContent className="bg-slate-800 text-gray-400">
            <AlertDialogHeader>
              <AlertDialogTitle>Description</AlertDialogTitle>
              <AlertDialogDescription className="text-white">{group.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='text-primary'>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <>
                {!invite && (
                  <Button
                    variant="link"
                    className="text-white disabled:cursor-wait disabled:text-gray-500"
                    onClick={() => inviteMutation.mutateAsync()}
                    disabled={!checkPermission(permission, 'INVITE_MEMBER')}
                  >
                    {!inviteMutation.isPending && <Copy size={20} />}
                    {inviteMutation.isPending && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-loader-circle animate-spin"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    )}
                  </Button>
                )}
                {invite && (
                  <Button variant="link" className="text-white" disabled>
                    <Check />
                  </Button>
                )}
              </>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy Invite Link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center mx-2">
        <Popover>
          <PopoverTrigger className="hover:bg-gray-500 rounded-md">
            <ChevronDown />
          </PopoverTrigger>
          <PopoverContent className="w-32 bg-gray-900 text-primary-foreground">
            <div className="flex flex-col justify-between">
              <LeaveGroup id={id} />

              {checkPermission(permission, 'MANAGE_GROUP') && (
                <>
                  <Separator className="w-full my-2 bg-gray-400" />
                  <GroupSettings id={id} />
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
