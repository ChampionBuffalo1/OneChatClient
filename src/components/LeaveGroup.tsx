import { AxiosError } from 'axios';
import { ApiError } from '@/typings';
import { LogOut } from 'lucide-react';
import { ToastAction } from './ui/toast';
import { axiosInstance } from '@/lib/api';
import { useToast } from './ui/use-toast';
import { useAppDispatch } from '@/lib/hooks';
import { useMutation } from '@tanstack/react-query';
import { removeGroup } from '@/lib/reducers/groups';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription
} from './ui/alert-dialog';

export default function LeaveGroup({ id, closeHandler }: { id: string; closeHandler: () => void }) {
  const { toast } = useToast();
  const disaptch = useAppDispatch();
  const leaveMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(`/group/${id}/leave`);
      return data.content.data;
    },
    onSuccess: (data: {
      id: string;
      user: { id: string; username: string };
      group: {
        id: string;
        name: string;
      };
    }) => {
      disaptch(removeGroup(data.group.id));
      closeHandler();
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
              onClick={() => leaveMutation.mutateAsync()}
              className="rounded-lg hover:bg-red-400 border border-gray-200 p-2"
            >
              Try again
            </ToastAction>
          )
        });
        return;
      }
      const code = error.response?.data.errors[0].code;
      if (code === 'ACTION_NOT_ALLOWED') {
        toast({
          title: 'Action Not Allowed',
          description: 'Group owner cannot leave group. You can delete the group instead.'
        });
      }
    }
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-red-500 p-2 rounded-md hover:bg-red-600 hover:cursor-pointer" asChild>
        <div className="flex justify-between">
          <LogOut />
          Leave
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-slate-800 text-primary-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-white">
            You will need an invite to join back this group.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-black hover:bg-slate-300">Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-slate-600" onClick={() => leaveMutation.mutateAsync()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
