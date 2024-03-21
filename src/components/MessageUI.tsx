import dayjs from '@/lib/dayjs';
import { AxiosError } from 'axios';
import { ApiError } from '@/typings';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ToastAction } from './ui/toast';
import { useToast } from './ui/use-toast';
import { axiosInstance } from '@/lib/api';
import { useAppDispatch } from '@/lib/hooks';
import { checkPermission } from '@/lib/utils';
import PermissionDialog from './PermissionDialog';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { X, Edit, Check, Trash2, MoreHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MessagePayload, MessageType, removeMessage } from '@/lib/reducers/groups';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './ui/context-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog';

interface MessageUIProps {
  message: MessageType;
  permission: number;
  groupId: string;
  userId: string;
}

export default function MessageUserInferface({ message, permission, groupId, userId }: MessageUIProps) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(message.text);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setText(message.text);
  }, [message]);

  const delMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete(`/group/${groupId}/message/${message.id}`);
      return data.content.data;
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
              onClick={() => delMutation.mutateAsync()}
              className="rounded-lg hover:bg-red-400 border border-gray-200 p-2"
            >
              Try again
            </ToastAction>
          )
        });
        return;
      }
      const code = error.response?.data.errors[0].code;
      if (code === 'INVALID_MESSAGE') {
        // Message has been deleted in server-side
        dispatch(
          removeMessage({
            id: message.id,
            group: { id: groupId } as MessagePayload['group']
          })
        );
      } else if (code === 'SERVICE_ERROR') {
        toast({ title: 'Unknown Error', description: 'An unknown error occured' });
      }
    }
  });

  const editMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data } = await axiosInstance.post<{ content: { data: MessagePayload } }>(
        `/group/${groupId}/message/edit`,
        JSON.stringify({
          id: message.id,
          text
        })
      );
      return data.content.data;
    },
    onSuccess: () => setEditMode(false),
    onError: (error: AxiosError<ApiError>, parameters) => {
      if (error.message === 'Network Error') {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: (
            <ToastAction
              altText="Try again"
              onClick={() => editMutation.mutateAsync(parameters)}
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
          description: "You don't have the permissions required to edit message"
        });
      }
    }
  });

  const EditButton = useCallback(
    () => (
      <Button
        variant="outline"
        className="w-full"
        disabled={editMutation.isPending}
        onClick={() => {
          setEditMode(true);
          setOpen(false);
        }}
      >
        <Edit className="mx-2" />
        Edit
      </Button>
    ),
    [editMutation.isPending]
  );

  const DeleteButton = useCallback(
    () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full" disabled={delMutation.isPending}>
            <Trash2 className="mx-2" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-slate-800 text-primary-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-white">
              Are you sure you want to delete this message? This action is permanent and cannot be undone
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black hover:bg-slate-300" onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-slate-600" onClick={() => delMutation.mutateAsync()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    [delMutation]
  );

  return (
    <div className="group flex items-start gap-2 my-2 hover:bg-slate-800 hover:rounded-md">
      <Avatar>
        <AvatarImage src={message.author.avatarUrl} />
        <AvatarFallback className="bg-[#d7a3ff] text-[#5f129b] text-lg">
          {message.author.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="font-medium">{message.author.username}</span>
            <span className="text-xs text-gray-500">{dayjs(message.updatedAt || message.createdAt).fromNow()}</span>
            {message.updatedAt !== message.createdAt && (
              <span className="-gap-1 font-thin text-xs text-gray-500">Edited</span>
            )}
          </div>

          <div className="absolute right-2 opacity-0 group-hover:opacity-100">
            {editMode && (
              <div className="flex space-x-2">
                <button
                  disabled={editMutation.isPending}
                  onClick={() => editMutation.mutateAsync(text)}
                  className="cursor-pointer disabled:cursor-wait text-green-500 disabled:text-gray-500"
                >
                  <Check />
                </button>

                <button
                  disabled={editMutation.isPending}
                  onClick={() => setEditMode(false)}
                  className="cursor-pointer disabled:cursor-wait text-red-500 disabled:text-gray-500"
                >
                  <X />
                </button>
              </div>
            )}
            {!editMode && (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger>
                  <div>
                    {(message.author.id === userId || checkPermission(permission, 'MANAGE_MESSAGES')) && (
                      <MoreHorizontal className="hover:bg-gray-700 hover:cursor-pointer hover:rounded-sm w-10" />
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-slate-700">
                  <div className="space-y-2">
                    {message.author.id === userId && <EditButton />}
                    {(message.author.id === userId || checkPermission(permission, 'MANAGE_MESSAGES')) && (
                      <DeleteButton />
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {!editMode && (
          <ContextMenu>
            <ContextMenuTrigger>
              <p className="mt-1">{text}</p>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-fit bg-slate-700">
              <ContextMenuItem>
                <EditButton />
              </ContextMenuItem>
              <ContextMenuItem onSelect={e => e.preventDefault()}>
                <DeleteButton />
              </ContextMenuItem>
              {checkPermission(permission, 'CHANGE_PERMISSION') && (
                <ContextMenuItem onSelect={e => e.preventDefault()}>
                  <PermissionDialog id={groupId} permission={permission} authorId={message.author.id} />
                </ContextMenuItem>
              )}
            </ContextMenuContent>
          </ContextMenu>
        )}
        {editMode && (
          <Textarea
            value={text}
            onChange={el => setText(el.target.value)}
            onKeyDown={el => {
              if (el.key === 'Escape') {
                el.preventDefault();
                setEditMode(false);
              }
              if (el.key === 'Enter') {
                el.preventDefault();
                editMutation.mutateAsync(text);
              }
            }}
            className="bg-gray-600 border border-primary focus:border-blue-600 text-white mx-2 w-[99%] h-8 resize-none overflow-y-auto"
          />
        )}
      </div>
    </div>
  );
}
