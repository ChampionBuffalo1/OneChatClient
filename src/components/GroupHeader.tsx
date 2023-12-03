import { Loader2 } from 'lucide-react';
import { axiosInstance } from '../lib/api';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '../lib/hooks';
import { removeGroup } from '../lib/reducers/groups';

export default function GroupHeader({ title, id }: { title: string; id: string }) {
  const dispatch = useAppDispatch();
  const mutation = useMutation({
    mutationFn: async () => {
      const data = await axiosInstance.post(`/group/${id}/leave/`);
      return data;
    },
    onSuccess: () => {
      dispatch(removeGroup(id));
    },
    onError: () => console.error(`Error while leaving group ${id}`)
  });

  return (
    <div className="top-0 flex justify-between rounded-sm bg-gray-950">
      <h1 className="text-2xl m-1 mx-2 p-2">{title}</h1>
      <button
        className="mx-2 border border-red-500 m-1 p-2 rounded-md text-lg hover:bg-red-500 hover:text-black hover:border-black"
        onClick={() => mutation.mutateAsync()}
      >
       {mutation.isPending ?  <Loader2 className="animate-spin w-14" /> : 'Leave'}
      </button>
    </div>
  );
}
